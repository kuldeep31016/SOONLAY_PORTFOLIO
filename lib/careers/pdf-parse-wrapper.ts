export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const { PdfReader } = await import("pdfreader")

  return new Promise<string>((resolve, reject) => {
    const reader = new PdfReader()

    let text = ""

    reader.parseBuffer(buffer, (err: string | null, item: { text?: string; [key: string]: unknown } | null) => {
      console.log("PDF reader callback:", { err, item: item ? { ...item, text: item.text?.substring(0, 50) } : null })

      if (err) {
        reject(new Error(`Failed to parse PDF: ${err}`))
        return
      }

      if (!item) {
        // End of parsing
        console.log("PDF parsing complete. Extracted text length:", text.length)
        resolve(text.trim())
        return
      }

      if (item.text) {
        console.log("Extracted text item:", item.text.substring(0, 100))
        text += item.text + " "
      }
    })
  })
}