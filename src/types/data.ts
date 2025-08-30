export type Step = {
    /** unique identifier for this step */
    id: string
    /** pre text */
    pretext: string
    /** id of the screenshot */
    screenshotId: string
    /** post text */
    posttext: string
}

export type Guide = {
    /** unique guide identifier */
    id: string
    /** title of the guide */
    title: string
    /** abstract for the guide */
    abstract: string
    /** recorded steps */
    steps: Step[]
    /** footnote */
    footnote: string
}
