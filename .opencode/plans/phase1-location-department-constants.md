# Phase 1 Implementation Plan: Location/Department Constants

## Objective
Add predefined location (countries + cities) and department lists to replace free-text inputs with autocomplete dropdowns in:
1. **Admin job form** (`admin/components/job-form.tsx`) - for creating/editing jobs
2. **Careers filter form** (`components/careers/JobFiltersForm.tsx`) - for job search filters

## Current State
- Locations/departments are **derived dynamically** from published jobs only (`buildFilterOptions()` in `lib/careers/listing.ts`)
- Admin form uses plain `<input type="text">` for location and department
- Filter dropdowns show only values that exist in published jobs
- No predefined lists exist

## Target State
- **Static constant lists** for countries, major cities, departments
- **Hierarchical locations**: Country → Cities (for better UX)
- **Admin form**: `<select>` with datalist autocomplete + "Custom..." option
- **Filter form**: Merge static constants with dynamic job values (static first, alphabetical)
- **Validation**: Keep as free-text (allow custom) but guide with suggestions

---

## Files to Create

### 1. `lib/careers/constants.ts` (NEW)
```typescript
export const COUNTRIES = [
  "India", "United States", "United Kingdom", "Canada", "Germany",
  "Australia", "Singapore", "Netherlands", "France", "Japan",
  "United Arab Emirates", "Switzerland", "Sweden", "Denmark", "Norway"
] as const;

export const INDIAN_CITIES = [
  "Bangalore", "Mumbai", "Delhi NCR", "Hyderabad", "Pune",
  "Chennai", "Kolkata", "Ahmedabad", "Gurgaon", "Noida",
  "Remote - India"
] as const;

export const US_CITIES = [
  "San Francisco Bay Area", "New York City", "Seattle", "Austin",
  "Boston", "Los Angeles", "Chicago", "Denver", "Remote - US"
] as const;

export const UK_CITIES = [
  "London", "Manchester", "Edinburgh", "Bristol", "Remote - UK"
] as const;

export const EU_CITIES = [
  "Berlin", "Munich", "Amsterdam", "Paris", "Dublin",
  "Stockholm", "Copenhagen", "Zurich", "Remote - EU"
] as const;

export const ALL_CITIES = [
  ...INDIAN_CITIES, ...US_CITIES, ...UK_CITIES, ...EU_CITIES,
  "Remote - Global", "Other"
] as const;

export const LOCATION_HIERARCHY: Record<string, readonly string[]> = {
  "India": INDIAN_CITIES,
  "United States": US_CITIES,
  "United Kingdom": UK_CITIES,
  "Germany": EU_CITIES.filter(c => c.includes("Berlin") || c.includes("Munich")),
  "Netherlands": EU_CITIES.filter(c => c.includes("Amsterdam")),
  "France": EU_CITIES.filter(c => c.includes("Paris")),
  "Singapore": ["Singapore", "Remote - Singapore"],
  "Australia": ["Sydney", "Melbourne", "Remote - Australia"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Remote - Canada"],
  "Other": ALL_CITIES,
} as const;

export const DEPARTMENTS = [
  "Engineering", "Product", "Design", "Data Science", "DevOps & Infrastructure",
  "Quality Assurance", "Security", "Engineering Management",
  "Sales", "Marketing", "Customer Success", "Operations",
  "Finance", "Human Resources", "Legal", "Research"
] as const;

export type Country = typeof COUNTRIES[number];
export type City = typeof ALL_CITIES[number];
export type Department = typeof DEPARTMENTS[number];
```

---

## Files to Modify

### 2. `admin/components/job-form.tsx`
**Changes:**
- Replace location `<input>` (line 192-196) with:
  - Country `<select>` (required) using `COUNTRIES`
  - City `<select>` (required) populated from `LOCATION_HIERARCHY[selectedCountry]`
  - "Other/Custom" option in both that reveals a text input
- Replace department `<input>` (line 187-191) with:
  - `<select>` using `DEPARTMENTS` + "Custom..." option that reveals text input
- Update `FormValues` type to use `country` + `city` instead of single `location`
- Update `buildInput()` to combine: `location = \`${city}, ${country}\`` (or just city if "Other")
- Update `initialValues()` to parse existing `location` string (format: "City, Country")

**UI Pattern:**
```tsx
<div className="field-group">
  <label htmlFor="job-country">Country</label>
  <select id="job-country" value={values.country} onChange={...} required>
    <option value="">Select country</option>
    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
    <option value="__custom__">Other…</option>
  </select>
  {values.country === "__custom__" && (
    <input id="job-custom-country" value={values.customCountry} onChange={...} placeholder="Enter country" />
  )}
</div>
<div className="field-group">
  <label htmlFor="job-city">City / Region</label>
  <select id="job-city" value={values.city} onChange={...} required>
    <option value="">Select city</option>
    {LOCATION_HIERARCHY[values.country]?.map(c => <option key={c} value={c}>{c}</option>) ?? []}
    <option value="__custom__">Other…</option>
  </select>
  {values.city === "__custom__" && (
    <input id="job-custom-city" value={values.customCity} onChange={...} placeholder="Enter city/region" />
  )}
</div>
```

### 3. `components/careers/JobFiltersForm.tsx`
**Changes:**
- In `FilterFields` component, modify location and department selects:
  - Location options: Merge `ALL_CITIES` (static) + `filters.locations` (dynamic from jobs)
  - Department options: Merge `DEPARTMENTS` (static) + `filters.departments` (dynamic from jobs)
  - Sort: Static first (alphabetical), then dynamic (alphabetical)
  - Deduplicate with `Set`

```typescript
function getLocationOptions(filters: JobFilters): string[] {
  const staticCities = new Set(ALL_CITIES);
  const dynamicCities = new Set(filters.locations);
  // Combine: static first, then dynamic not in static
  return [...ALL_CITIES, ...filters.locations.filter(l => !staticCities.has(l))].sort();
}
```

### 4. `lib/careers/listing.ts` - `buildFilterOptions()`
**Changes:**
- Ensure dynamic filters still work (no breaking changes)
- The static constants are now the "source of truth" for suggestions

### 5. `admin/lib/schemas.ts` (optional validation enhancement)
- Add `.refine()` to warn if department/location not in known lists (but still allow)
- Keep as `string` type to allow custom entries

---

## Implementation Order

| Step | File | Description |
|------|------|-------------|
| 1 | `lib/careers/constants.ts` | Create new constants file |
| 2 | `admin/components/job-form.tsx` | Update location (country+city) and department fields |
| 3 | `components/careers/JobFiltersForm.tsx` | Merge static + dynamic filter options |
| 4 | `admin/lib/schemas.ts` | Optional: add soft validation warnings |
| 5 | Test locally | Verify admin create/edit, filter dropdowns |

---

## Testing Checklist

### Admin Job Form
- [ ] Create new job: Country → City cascading works
- [ ] Create new job: "Other" country → custom text input appears
- [ ] Create new job: "Other" city → custom text input appears
- [ ] Create new job: Department dropdown + "Custom" works
- [ ] Edit existing job: Parses "City, Country" correctly
- [ ] Edit existing job: Department populates correctly
- [ ] Save draft/publish: `location` saved as "City, Country" format
- [ ] Validation: Required fields enforced

### Careers Filter Form
- [ ] Location dropdown shows static cities + any dynamic from jobs
- [ ] Department dropdown shows static departments + any dynamic from jobs
- [ ] No duplicates in dropdowns
- [ ] Filtering by location/department works
- [ ] "Clear filters" works

### Edge Cases
- [ ] Job with location not in static lists (e.g., "Tokyo, Japan") → shows in filter dropdown
- [ ] Empty jobs collection → static lists still appear in filters
- [ ] Admin creates job with custom location → appears in public filters

---

## TypeScript Types Update

Add to `lib/careers/types.ts`:
```typescript
// Import from constants
export type { Country, City, Department } from "./constants";
```

---

## Backward Compatibility

- **Database format unchanged**: `location` remains single string "City, Country"
- **API unchanged**: Public job query params unchanged (`location`, `department`)
- **Admin API unchanged**: Still accepts `location` and `department` as strings
- **Existing jobs**: Parsed correctly on edit (split by last comma)

---

## Dependencies
- No new npm packages needed for Phase 1
- Uses existing React patterns (controlled inputs, state)

---

## Estimated Effort
- **Constants file**: 30 min
- **Admin form**: 2-3 hours (cascading selects, custom handling, parsing)
- **Filter form**: 1 hour (merge logic)
- **Testing**: 1 hour
- **Total**: ~4-5 hours

---

## Next Steps (After Phase 1)
- Phase 2: Resume upload API + Grok integration
- Phase 3: ResumeRecommendations UI component
- Phase 4: Careers page integration + client-side caching