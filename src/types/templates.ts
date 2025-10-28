  export type MaybeI18nString = string | Record<string, string>
export type ExportFormat = "pdf" | "markdown"
export type TemplateMetadata = {
  id: string
  displayName: MaybeI18nString
  description?: MaybeI18nString
  version?: string
  author?: string
  formats: ExportFormat[]
  links?: Array<{
    social: string
    tooltip?: string
    url: string
  }>
}

export type TemplateContext = {
  title: string
  abstract: string
  nodes: Array<
    | { id: string, type: "text", text: string }
    | { id: string, type: "image", path: string }
  >
  footnote: string
}
