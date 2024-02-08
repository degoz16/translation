import type {CustomRenderer} from '@diplodoc/markdown-it-custom-renderer';
import type {XLFRenderState} from 'src/xliff/renderer/md-xliff';
import type Renderer from 'markdown-it/lib/renderer';
import type Token from 'markdown-it/lib/token';
import {generateX} from 'src/xliff/generator';

import {VideoToken} from '@diplodoc/transform/lib/plugins/video/types';

export const video: Renderer.RenderRuleRecord = {
    video: videoRule,
};

function videoRule(this: CustomRenderer<XLFRenderState>, tokens: Token[], i: number) {
    const {service, videoID} = tokens[i] as VideoToken;

    return generateX({ctype: 'video', equivText: `@[${service}](${videoID})`});
}
