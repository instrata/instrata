
export type MaybeI18nString = string | Record<string, string>
export type TemplateMetadata = {
  id: string
  displayName: MaybeI18nString
  description?: MaybeI18nString
  version?: string
  author?: string
  formats: string[]
  links?: Array<{
    social: string
    tooltip?: string
    url: string
  }>
}
