export type Guide = {
    /** unique guide identifier */
    id: string
    /** title of the guide */
    title: string
    /** abstract for the guide */
    abstract: string
    /** nodes */
    nodes: Node[]
    /** footnote */
    footnote: string
}

export type GuideInfo = {
    mtime: Date | null
    birthTime: Date | null
}

export type Node = TextNode | ImageNode;

export type TextNode = {
    id: string
    type: "text"
    /** text content as html */
    text: string
}

export type ImageNode = {
    id: string
    type: "image"
    /** id of the image file */
    imageId: string
}
