import assert from 'assert';
import {XLFToken, XLFTagToken, XLFTextToken, isXLFTagToken, isXLFTextToken} from 'src/xlf/token';

export type XLFMDRendererRuleSet = {
    text: XLFMDRendererRule;
    [key: string]: XLFMDRendererRule;
};

export type XLFMDRendererRule = (token: XLFToken) => string;

class XLFMDRenderer {
    rules: XLFMDRendererRuleSet;

    constructor() {
        this.rules = {
            text: this.text.bind(this),
            tag: this.tag.bind(this),
            g: this.g.bind(this),
            strong: this.strong.bind(this),
            em: this.em.bind(this),
            s: this.s.bind(this),
            sup: this.sup.bind(this),
            samp: this.samp.bind(this),
            x: this.x.bind(this),
            code: this.code.bind(this),
            link_text_part: this.linkTextPart.bind(this),
            link_attributes_part: this.linkAttributesPart.bind(this),
            link_attributes_title: this.linkAttributesTitle.bind(this),
            link_attributes_href: this.linkAttributesHref.bind(this),
            link_reflink: this.linkRefLink.bind(this),
            link_autolink: this.linkAutolink.bind(this),
        };
    }

    render(tokens: XLFToken[]): string {
        let rendered = '';

        for (const token of tokens) {
            const handler = this.rules[token.type];
            if (handler) {
                rendered += handler(token);
            }
        }

        return rendered;
    }

    text(token: XLFToken): string {
        assert(isXLFTextToken(token));
        token as XLFTextToken;

        return token.data;
    }

    tag(token: XLFToken): string {
        const handler = this.rules[token.data];
        if (!handler) {
            return '';
        }

        return handler(token);
    }

    g(token: XLFToken): string {
        assert(isXLFTagToken(token));
        token as XLFTagToken;

        const syntax = token.syntax;
        if (!syntax?.length) {
            throw new Error("can't render g tag without syntax");
        }

        const handler = this.rules[syntax];
        if (!handler) {
            throw new Error(`syntax ${syntax} not implemented`);
        }

        return handler(token);
    }

    strong(token: XLFToken): string {
        assert(isXLFTagToken(token));
        token as XLFTagToken;
        if (!token?.equivText) {
            throw new Error(`token: ${token} missing equiv-text`);
        }

        return token.equivText ?? '**';
    }

    em(token: XLFToken): string {
        assert(isXLFTagToken(token));
        token as XLFTagToken;
        if (!token?.equivText) {
            throw new Error(`token: ${token} missing equiv-text`);
        }

        return token.equivText ?? '*';
    }

    s(token: XLFToken): string {
        assert(isXLFTagToken(token));
        token as XLFTagToken;

        if (!token?.equivText) {
            throw new Error(`token: ${token} missing equiv-text`);
        }

        return token.equivText ?? '~~';
    }

    sup(token: XLFToken): string {
        assert(isXLFTagToken(token));
        token as XLFTagToken;

        if (!token?.equivText) {
            throw new Error(`token: ${token} missing equiv-text`);
        }

        return token.equivText ?? '^';
    }

    samp(token: XLFToken): string {
        assert(isXLFTagToken(token));
        token as XLFTagToken;

        if (!token?.equivText) {
            throw new Error(`token: ${token} missing equiv-text`);
        }

        return token.equivText ?? '##';
    }

    linkTextPart(token: XLFToken): string {
        assert(isXLFTagToken(token));
        token as XLFTagToken;

        const {equivText, nodeType} = token;

        if (equivText?.length !== 2) {
            throw new Error(`token: ${token} has invalid equiv-text`);
        }

        const [open, close] = equivText.split('');

        return nodeType === 'open' ? open : close;
    }

    linkAttributesPart(token: XLFToken): string {
        assert(isXLFTagToken(token));
        token as XLFTagToken;

        const {equivText, nodeType} = token;

        if (equivText?.length !== 2) {
            throw new Error(`token: ${token} has invalid equiv-text`);
        }

        const [open, close] = equivText.split('');

        return nodeType === 'open' ? open : close;
    }

    linkAttributesTitle(token: XLFToken): string {
        assert(isXLFTagToken(token));
        token as XLFTagToken;

        const {equivText, nodeType} = token;

        if (equivText?.length !== 2) {
            throw new Error(`token: ${token} has invalid equiv-text`);
        }

        const [open, close] = equivText.split('');

        return nodeType === 'open' ? ' ' + open : close;
    }

    x(token: XLFToken): string {
        assert(isXLFTagToken(token));
        token as XLFTagToken;

        const syntax = token.syntax;
        if (!syntax?.length) {
            throw new Error("can't render g tag without syntax");
        }

        const handler = this.rules[syntax];
        if (!handler) {
            throw new Error(`syntax ${syntax} not implemented`);
        }

        return handler(token);
    }

    code(token: XLFToken): string {
        assert(isXLFTagToken(token));
        token as XLFTagToken;

        assert(token.equivText?.length, 'x supposed to wrap original markup inside equiv-text');

        return token.equivText;
    }

    linkAttributesHref(token: XLFToken): string {
        assert(isXLFTagToken(token));
        token as XLFTagToken;

        assert(
            token.equivText?.length,
            `x supposed to wrap original link href markup inside equiv-text`,
        );

        return token.equivText;
    }

    linkRefLink(token: XLFToken): string {
        assert(isXLFTagToken(token));
        token as XLFTagToken;

        assert(
            token.equivText?.length,
            `x supposed to wrap original ref link markup inside equiv-text`,
        );

        return token.equivText;
    }

    linkAutolink(token: XLFToken): string {
        assert(isXLFTagToken(token));
        token as XLFTagToken;

        assert(
            token.equivText?.length,
            `x supposed to wrap original ref link markup inside equiv-text`,
        );

        return token.equivText;
    }
}

export {XLFMDRenderer};
export default {XLFMDRenderer};
