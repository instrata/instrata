---
title: Templates
---

# ::notepad-text-dashed:: Templates

Templates define how your exported guides are formatted and presented.
They control layout, styling, and structure for each output format such as Markdown or PDF.
You can use the built-in templates or create your own to match your branding or preferred style.

## ::list:: Inspect Available Templates

To see available templates, open **Settings → Templates** inside Instrata.  
You can also use the button there to open the template directory and add your own custom templates.

## ::list-plus:: Creating a Custom Template

Creating a custom template lets you control exactly how your exported guides look.
This is useful for companies or teams that want consistent branding or users who prefer a specific format for documentation.

### Template Structure

Each template has a defined folder structure:

```text
my-template/
├─ metadata.json
├─ template.md.j2
├─ template.typ.j2
├─ assets/
```

- **`metadata.json`** - basic information about your template.
- **`template.md.j2`** - layout for Markdown exports.
- **`template.typ.j2`** - layout for PDF exports using Typst.
- **`assets/`** - optional folder for images or other resources such as logos.

### `metadata.json`

```ts
// Text or mapping between locale (e.g. en, de) and the translated text
type MaybeI18nString = string | Record<string, string>
// Formats support for export
type ExportFormats = "pdf" | "markdown"
// Structure of the JSON within metadata.json
type TemplateMeta = {
  // Template-Name displayed in the UI
  displayName: MaybeI18nString
  // Optional description
  description?: MaybeI18nString
  // Template version
  version?: string
  // Template author
  author?: string
  // List of formats supported by this template.
  // A template can support multiple export-formats.
  formats: ExportFormats[]
  // Links to your repository or social account.
  links?: Array<{
    // Icon name from simple-icons
    social: string
    // Optional tooltip when hovering above the link
    tooltip?: string
    // URL to a social account or website
    url: string
  }>
}
```

### Template Data

When rendering a guide, Instrata passes the following data to your template:

```ts
// Data available within the tera template
type TemplateData = {
  // Title of the Guide
  title: string
  // Abstract of the Guide
  abstract: string
  // Steps and images within your guide
  nodes: Array<
    | { type: "text", text: string }
    | { type: "image", screenshotId: string }
  >
  // Footer of the Guide
  footer: string
}
```

You can use these fields to dynamically insert content into your templates.

### Template Engine

Instrata uses [tera](https://keats.github.io/tera/), a template engine similar to [::social/jinja:: Jinja2](https://jinja.palletsprojects.com/en/stable/) and [::social/django:: Django Templates](https://docs.djangoproject.com/en/5.2/topics/templates/).  
Tera supports variables, loops, conditionals, and filters for flexible layouts.

## About Markdown Templates

For Markdown exports, include a `template.md.j2` file:

```text
my-template/
├─ metadata.json
├─ template.md.j2
```

The rendered output will be a `.md` file that you can view or convert to other formats.

## About PDF Templates

Instrata uses [::social/typst:: Typst](https://typst.app/) to generate PDFs. Typst is lightweight, fast, and gives you full control over layout and typography.  
For PDF templates, include a `template.typ.j2` file:

```text
my-template/
├─ metadata.json
├─ template.typ.j2
```

You can use Typst syntax inside your template file to style text, images, and layout elements.
