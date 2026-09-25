import { FieldValue } from "firebase-admin/firestore"

export interface FakeDocument {
  id: string
  data: Record<string, unknown>
}

type Store = Map<string, Record<string, unknown>>

interface Snapshot<T> {
  id: string
  exists: boolean
  data: () => T
}

const DELETE = FieldValue.delete()
const SERVER_TIMESTAMP = FieldValue.serverTimestamp()

let clock = 0
let autoId = 0

export function resetFirestore(): void {
  clock = 0
  autoId = 0
}

function nowIso(): string {
  clock += 1
  return new Date(Date.UTC(2026, 0, 1) + clock * 86_400_000).toISOString()
}

function applyPatch(target: Record<string, unknown>, patch: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(patch)) {
    if (value === DELETE) {
      delete target[key]
    } else if (value === SERVER_TIMESTAMP) {
      target[key] = nowIso()
    } else {
      target[key] = value
    }
  }
}

function materialize(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    if (value === DELETE) {
      continue
    }
    result[key] = value === SERVER_TIMESTAMP ? nowIso() : value
  }
  return result
}

function compareCondition(actual: unknown, operator: string, expected: unknown): boolean {
  switch (operator) {
    case "==":
      return actual === expected
    case "!=":
      return actual !== expected
    default:
      throw new Error(`FakeFirestore does not support the "${operator}" operator`)
  }
}

function readPath(data: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => {
    if (typeof value !== "object" || value === null) {
      return undefined
    }
    return (value as Record<string, unknown>)[key]
  }, data)
}

export class FakeDocumentReference {
  constructor(
    private readonly getStore: () => Store,
    readonly collectionId: string,
    readonly id: string
  ) {}

  async get(): Promise<Snapshot<Record<string, unknown>>> {
    const data = this.getStore().get(this.id)
    return { id: this.id, exists: data !== undefined, data: () => ({ ...(data ?? {}) }) }
  }

  async update(patch: Record<string, unknown>): Promise<void> {
    const store = this.getStore()
    const data = store.get(this.id)
    if (data === undefined) {
      throw new Error(`Document ${this.id} does not exist`)
    }
    applyPatch(data, patch)
  }

  async set(data: Record<string, unknown>): Promise<void> {
    const store = this.getStore()
    const existing = store.get(this.id) ?? {}
    applyPatch(existing, data)
    store.set(this.id, existing)
  }
}

class FakeQuery {
  private conditions: Array<{ field: string; operator: string; value: unknown }> = []
  private max: number | null = null

  constructor(
    protected readonly getStore: () => Store,
    readonly collectionId: string,
    private readonly queryId: string | null = null
  ) {}

  where(field: string, operator: string, value: unknown): FakeQuery {
    if (this.queryId !== null) {
      throw new Error("FakeFirestore only models document reads, not sub-collection queries")
    }
    const next = new FakeQuery(this.getStore, this.collectionId)
    next.conditions = [...this.conditions, { field, operator, value }]
    next.max = this.max
    return next
  }

  limit(count: number): FakeQuery {
    const next = new FakeQuery(this.getStore, this.collectionId, this.queryId)
    next.conditions = this.conditions
    next.max = count
    return next
  }

  async get(): Promise<{ docs: Array<{ id: string; data: () => Record<string, unknown> }> }> {
    if (this.queryId !== null) {
      const single = this.getStore().get(this.queryId)
      return {
        docs: single === undefined ? [] : [{ id: this.queryId, data: () => ({ ...single }) }]
      }
    }

    let documents = Array.from(this.getStore(), ([id, data]) => ({
      id,
      data: () => ({ ...data })
    }))

    for (const condition of this.conditions) {
      documents = documents.filter((document) =>
        compareCondition(
          readPath(document.data(), condition.field),
          condition.operator,
          condition.value
        )
      )
    }

    if (this.max !== null) {
      documents = documents.slice(0, this.max)
    }

    return { docs: documents }
  }
}

class FakeCollectionReference extends FakeQuery {
  constructor(getStore: () => Store, collectionId: string) {
    super(getStore, collectionId)
  }

  doc(id?: string): FakeDocumentReference {
    return new FakeDocumentReference(
      this.getStore,
      this.collectionId,
      id ?? `generated-${++autoId}`
    )
  }
}

/**
 * A small in-memory stand-in for the Firestore SDK covering only what the
 * careers repository uses. Compound filters are rejected on purpose: the
 * production queries must stay on single-field indexes, so a regression that
 * reintroduces a composite query fails loudly here instead of at runtime.
 */
export class FakeFirestore {
  private readonly collections = new Map<string, Store>()

  private store(collectionId: string): Store {
    let store = this.collections.get(collectionId)
    if (store === undefined) {
      store = new Map()
      this.collections.set(collectionId, store)
    }
    return store
  }

  collection(collectionId: string): FakeCollectionReference {
    return new FakeCollectionReference(() => this.store(collectionId), collectionId)
  }

  seed(collectionId: string, documents: FakeDocument[]): void {
    const store = this.store(collectionId)
    for (const document of documents) {
      store.set(document.id, { ...document.data })
    }
  }

  read(collectionId: string): Array<Record<string, unknown>> {
    return Array.from(this.store(collectionId).values()).map((data) => ({ ...data }))
  }

  async runTransaction<T>(
    update: (transaction: {
      getAll: (...references: FakeDocumentReference[]) => Promise<Snapshot<Record<string, unknown>>[]>
      create: (reference: FakeDocumentReference, data: Record<string, unknown>) => void
      set: (reference: FakeDocumentReference, data: Record<string, unknown>) => void
    }) => Promise<T>
  ): Promise<T> {
    const working = new Map<string, Store>()
    for (const [id, store] of this.collections) {
      working.set(id, new Map(Array.from(store, ([key, value]) => [key, { ...value }])))
    }

    const lookup = (collectionId: string) => {
      let store = working.get(collectionId)
      if (store === undefined) {
        store = new Map()
        working.set(collectionId, store)
      }
      return store
    }

    const result = await update({
      getAll: async (...references: FakeDocumentReference[]) =>
        references.map((reference) => {
          const data = lookup(reference.collectionId).get(reference.id)
          return {
            id: reference.id,
            exists: data !== undefined,
            data: () => ({ ...(data ?? {}) })
          }
        }),
      create: (reference: FakeDocumentReference, data: Record<string, unknown>) => {
        const store = lookup(reference.collectionId)
        if (store.has(reference.id)) {
          throw new Error(`Document ${reference.id} already exists`)
        }
        // Real Firestore rejects FieldValue.delete() in create(), because there
        // is no existing document for it to remove the field from. Silently
        // dropping the sentinel here would let this class of bug reach
        // production, so the double fails the same way Firestore does.
        for (const [key, value] of Object.entries(data)) {
          if (value === DELETE) {
            throw new Error(
              `FieldValue.delete() for "${key}" is not allowed in create(); omit the field instead`
            )
          }
        }
        store.set(reference.id, materialize(data))
      },
      set: (reference: FakeDocumentReference, data: Record<string, unknown>) => {
        const store = lookup(reference.collectionId)
        const existing = store.get(reference.id) ?? {}
        applyPatch(existing, data)
        store.set(reference.id, existing)
      }
    })

    for (const [id, store] of working) {
      this.collections.set(id, store)
    }

    return result
  }
}

export function installFakeFirestore(): FakeFirestore {
  resetFirestore()
  return new FakeFirestore()
}
