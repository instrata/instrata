
export function repeat(character: string, count: number): string {
    return Array(count + 1).join(character);
}

export function trimLeadingNewlines(string: string): string {
    return string.replace(/^\n+/, "");
}

export function trimTrailingNewLines(string: string): string {
    return string.replace(/\n+$/, "");
}

const BLOCK_ELEMENTS = [
    'ADDRESS', 'ARTICLE', 'ASIDE', 'AUDIO', 'BLOCKQUOTE', 'BODY', 'CANVAS',
    'CENTER', 'DD', 'DIR', 'DIV', 'DL', 'DT', 'FIELDSET', 'FIGCAPTION', 'FIGURE',
    'FOOTER', 'FORM', 'FRAMESET', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER',
    'HGROUP', 'HR', 'HTML', 'ISINDEX', 'LI', 'MAIN', 'MENU', 'NAV', 'NOFRAMES',
    'NOSCRIPT', 'OL', 'OUTPUT', 'P', 'PRE', 'SECTION', 'TABLE', 'TBODY', 'TD',
    'TFOOT', 'TH', 'THEAD', 'TR', 'UL'
];

export function htmlIsBlock(node: HTMLElement): boolean {
    return nodeIs(node, BLOCK_ELEMENTS);
}

const VOID_ELEMENTS = [
    'AREA', 'BASE', 'BR', 'COL', 'COMMAND', 'EMBED', 'HR', 'IMG', 'INPUT',
    'KEYGEN', 'LINK', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR'
];

export function htmlIsVoid(node: HTMLElement): boolean {
    return nodeIs(node, VOID_ELEMENTS);
}

export function htmlHasVoid(node: HTMLElement): boolean {
    return nodeHas(node, VOID_ELEMENTS);
}

const MEANINGFUL_WHEN_BLANK_ELEMENTS = [
    'A', 'TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TH', 'TD', 'IFRAME', 'SCRIPT',
    'AUDIO', 'VIDEO'
]

export function isMeaningfulWhenBlank (node: HTMLElement): boolean {
    return nodeIs(node, MEANINGFUL_WHEN_BLANK_ELEMENTS)
}

export function hasMeaningfulWhenBlank (node: HTMLElement): boolean {
    return nodeHas(node, MEANINGFUL_WHEN_BLANK_ELEMENTS)
}


function nodeIs(node: HTMLElement, tagNames: string[]) {
    return tagNames.includes(node.tagName.toUpperCase());
}

function nodeHas(node: HTMLElement, tagNames: string[]) {
    return tagNames.some(tagName => node.getElementsByTagName(tagName).length > 0)
}
