import type {CustomRenderer, CustomRendererHookParameters} from '@diplodoc/markdown-it-custom-renderer';
import type {XLFRenderState} from 'src/xliff/renderer/md-xliff';
import MarkdownIt from 'markdown-it';
import {unescapeSymbols} from 'src/xliff/symbols';

const escapeHTML = new MarkdownIt().utils.escapeHtml;

export function afterInline(
    this: CustomRenderer<XLFRenderState>,
    parameters: CustomRendererHookParameters,
) {
    if (!parameters.rendered) {
        return '';
    }

    let rendered = parameters.rendered.join('');
    if (!rendered.length) {
        return '';
    }

    rendered = escapeHTML(rendered);
    rendered = unescapeSymbols(rendered);

    parameters.rendered.splice(0, parameters.rendered.length, rendered);

    return '';
}
