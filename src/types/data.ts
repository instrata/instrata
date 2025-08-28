export type Step = {
    /** unique identifier for this step */
    id: string
    /** pre text */
    pretext: string
    /** data-url of the screenshot */
    screenshot: string
    /** post text */
    posttext: string
}

export type Guide = {
    /** title of the guide */
    title: string
    /** abstract for the guide */
    abstract: string
    /** recorded steps */
    steps: Step[]
    /** footnote */
    footnote: string
}
