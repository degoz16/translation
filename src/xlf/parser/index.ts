import {XMLValidator} from 'fast-xml-parser';
import cheerio, {Cheerio} from 'cheerio';
import {Element, ChildNode, isTag, isText} from 'domhandler';

import {XLFToken, XLFTagToken, XLFTextToken} from 'src/xlf/token';

export type GetTranslationsParameters = {
    xlf: string;
    useSource?: boolean;
};

function parseTranslations(parameters: GetTranslationsParameters): Array<Array<XLFToken>> {
    if (!validParameters(parameters)) {
        throw new Error('invalid parameters');
    }

    const {useSource = false} = parameters;
    let xlf = parameters.xlf;
    let {targets, success} = selectTargets(xlf);
    if (!success) {
        if (useSource) {
            xlf = replaceSourceWithTarget(xlf);
            ({targets, success} = selectTargets(xlf));
        } else {
            throw new Error('did not find any translations');
        }
    }

    return parseTargets(targets);
}

function replaceSourceWithTarget(xlf: string) {
    return xlf.replace(/<source>/gmu, '<target>').replace(/<\/source>/gmu, '</target>');
}

function selectTargets(xlf: string) {
    let success = true;
    const query = cheerio.load(xlf);

    const targets = query('trans-unit').find('target');
    if (targets.length === 0) {
        success = false;
    }

    return {
        targets,
        success,
    };
}

function parseTargets(targets: Cheerio<Element>) {
    const parsed = new Array<Array<XLFToken>>();
    const ref = {nodes: []};

    for (const target of targets.get()) {
        inorderNodes(target, ref);

        const tokens = nodesIntoXLFTokens(ref.nodes);
        parsed.push(tokens);

        ref.nodes = [];
    }

    return parsed;
}

function inorderNodes(node: ChildNode, ref: {nodes: ChildNode[]}) {
    if (!node) {
        return;
    }

    ref.nodes.push(node);

    if (isTag(node)) {
        let next = node.firstChild;

        while (next) {
            inorderNodes(next, ref);
            next = next.nextSibling;
        }
    }

    if (isTag(node)) {
        ref.nodes.push(node);
    }
}

function nodesIntoXLFTokens(nodes: ChildNode[]): XLFToken[] {
    const tokens = new Array<XLFToken>();

    for (const node of nodes) {
        if (isTag(node)) {
            const token: XLFTagToken = {
                type: 'tag',
                data: node.name,
            };

            if (node?.attribs?.ctype?.length) {
                token.ctype = node.attribs.ctype;
            }

            if (node?.attribs['equiv-text']?.length) {
                token.equivText = node.attribs['equiv-text'];
            }

            tokens.push(token);
        } else if (isText(node)) {
            const token: XLFTextToken = {
                type: 'text',
                data: node.data,
            };
            tokens.push(token);
        }
    }

    return tokens;
}

function validParameters(parameters: GetTranslationsParameters) {
    const {xlf} = parameters;

    const conditions = [Boolean(xlf), validXML(xlf)];

    return conditions.reduce((a, v) => a && v, true);
}

function validXML(xml: string) {
    const validation = XMLValidator.validate(xml);

    return typeof validation === 'boolean' && validation;
}

export {parseTranslations, validParameters};
export default {parseTranslations, validParameters};