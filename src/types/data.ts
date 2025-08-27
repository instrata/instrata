export type Step = {
    /** data-url of the screenshot */
    screenshot: string
}

export type Project = {
    /** recorded steps */
    steps: Step[]
}
