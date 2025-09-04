import {
    hasMeaningfulWhenBlank,
    htmlHasVoid, htmlIsBlock,
    htmlIsVoid,
    isMeaningfulWhenBlank,
    trimLeadingNewlines,
    trimTrailingNewLines
} from "@/lib/html-conv/utilities.ts";


type FilterFunction = (this: ConverterRule, node: HTMLElement) => boolean
type ReplaceMentFunction = (content: string, node: HTMLElement, options: ConverterOptions) => string
export type ConverterRule = {
    filter: string | string[] | FilterFunction
    replacement: ReplaceMentFunction
}

export type EscapeRule = [RegExp, string];


type ConverterOptions = {
    rules: ConverterRule[]
    escapes: EscapeRule[]
}


export function htmlConverter(input: string, options: ConverterOptions): string {
    if (input === "") return "";

    const rootNode: HTMLElement = new DOMParser().parseFromString(input, "text/html").documentElement;
    return processor(rootNode, options);
}


function processor(parentNode: HTMLElement, options: ConverterOptions): string {
    const childNodes: HTMLElement[] = Array.from(parentNode.childNodes) as HTMLElement[];
    return childNodes.reduce((output, node) => {
        let replacement: string = "";
        if (node.nodeType === Node.TEXT_NODE) {
            replacement = htmlIsCode(node) ? node.nodeValue! : escapeString(node.nodeValue!, options.escapes);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const rule = findRuleForNode(options.rules, node);
            let content = processor(node, options);
            const whitespace = getFlankingWhitespace(node)
            if (whitespace.leading || whitespace.trailing) content = content.trim();
            replacement = whitespace.leading + rule.replacement(content, node, options) + whitespace.trailing;
        }

        return cleanJoin(output, replacement);
    }, '');
}


function escapeString(string: string, escapes: EscapeRule[]) {
    return escapes.reduce((str, escape) => {
        return str.replace(escape[0], escape[1]);
    }, string);
}

function cleanJoin(output: string, replacement: string) {
    const s1 = trimTrailingNewLines(output);
    const s2 = trimLeadingNewlines(replacement);
    const nls = Math.max(output.length - s1.length, replacement.length - s2.length);
    const separator = "\n\n".substring(0, nls);
    return s1 + separator + s2;
}


function findRuleForNode(rules: ConverterRule[], node: HTMLElement): ConverterRule {
    if (isBlankNode(node)) return {
        filter: [],
        replacement: (_, node) => {
            return htmlIsBlock(node) ? "\n\n" : "";
        }
    }
    for (const rule of rules) {
        if (ruleMatches(rule, node)) return rule;
    }
    return {
        filter: [],
        replacement: (content, node) => {
            return htmlIsBlock(node) ? "\n\n" + content + "\n\n" : content;
        },
    };
}


function ruleMatches(rule: ConverterRule, node: HTMLElement) {
    const filter = rule.filter;
    if (typeof filter === "string") {
        return filter === node.nodeName.toLowerCase();
    } else if (Array.isArray(filter)) {
        return filter.indexOf(node.nodeName.toLowerCase()) !== -1;
    } else if (typeof filter === "function") {
        return filter.call(rule, node);
    } else {
        throw new TypeError('`filter` needs to be a string, array or function');
    }
}

function isBlankNode(node: HTMLElement): boolean {
    return (
            !htmlIsVoid(node) &&
            !isMeaningfulWhenBlank(node) &&
            /^\s*$/.test(node.textContent!) &&
            !htmlHasVoid(node) &&
            !hasMeaningfulWhenBlank(node)
    );
}

function htmlIsCode(node: HTMLElement): boolean {
    return !!node && (node.nodeName === "CODE" || htmlIsCode(node.parentNode as HTMLElement));
}


function getFlankingWhitespace(node: HTMLElement) {
    if (htmlIsBlock(node) || htmlIsCode(node)) {
        return { leading: "", trailing: "" };
    }

    const edges = edgeWhitespace(node.textContent!);

    if (edges.leadingAscii && isFlankedByWhitespace("left", node)) {
        edges.leading = edges.leadingNonAscii;
    }

    if (edges.trailingAscii && isFlankedByWhitespace("right", node)) {
        edges.trailing = edges.trailingNonAscii;
    }

    return { leading: edges.leading, trailing: edges.trailing };
}

function edgeWhitespace(string: string) {
    const m = string.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/)!;
    return {
        leading: m[1],  // whole string for whitespace-only strings
        leadingAscii: m[2],
        leadingNonAscii: m[3],
        trailing: m[4],  // whole string for whitespace-only strings
        trailingNonAscii: m[5],
        trailingAscii: m[6],
    };
}


function isFlankedByWhitespace(side: "left" | "right", node: HTMLElement) {
    let sibling: HTMLElement;
    let regexp: RegExp;

    if (side === "left") {
        sibling = node.previousSibling as HTMLElement;
        regexp = / $/;
    } else {
        sibling = node.nextSibling as HTMLElement;
        regexp = /^ /;
    }

    let isFlanked: boolean = false;

    if (sibling) {
        if (sibling.nodeType === Node.TEXT_NODE) {
            isFlanked = regexp.test(sibling.nodeValue!);
        } else if (sibling.nodeType === Node.ELEMENT_NODE && !htmlIsBlock(sibling)) {
            isFlanked = regexp.test(sibling.textContent!);
        }
    }

    return isFlanked;
}
