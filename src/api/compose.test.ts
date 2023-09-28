import {compose, ComposeParameters} from './compose';
import {template, transUnit} from 'src/xlf/generator';

const templateParameters = {
    source: {language: 'en', locale: 'US' as const},
    target: {language: 'ru', locale: 'RU' as const},
    markdownPath: 'file.md',
    skeletonPath: 'file.skl.md',
};

const {
    template: [before, after],
    indentation,
} = template.generate(templateParameters);

const transUnits = [
    {source: 'Sentence about something', target: 'Предложение о чем-то', id: 0, indentation},
    {source: 'Text fragment', target: 'Фрагмент Текста', id: 1, indentation},
];

const xlf = before + transUnits.map(transUnit.generate).join('') + after;

describe('smoke', () => {
    it('works', () => {
        const parameters = {
            skeleton: '',
            xlf: xlf,
        };

        compose(parameters);
    });
});

describe('validates parameters', () => {
    it('works with valid parameters', () => {
        const parameters = {
            skeleton: '',
            xlf: xlf,
        };

        compose(parameters);
    });

    it('throws on invalid parameters', () => {
        const invalidXLF = {
            xlf: '',
        };

        const invalidSkeleton = {
            xlf: xlf,
        };

        const invalidBoth = {};

        const invalidLang = {xlf, skeleton: '', lang: 'xx'};

        expect(() => compose(invalidSkeleton as ComposeParameters)).toThrow();
        expect(() => compose(invalidXLF as ComposeParameters)).toThrow();
        expect(() => compose(invalidBoth as ComposeParameters)).toThrow();
        expect(() => compose(invalidLang as ComposeParameters)).toThrow();
    });
});
