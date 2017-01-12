import {Pipe, PipeTransform} from '@angular/core';

declare const markdown: {
    toHTML: (markdown: string, theme?: string) => string;
};

function markdownToHtml(markdownContent: string): string {
    return markdown.toHTML(markdownContent);
}

@Pipe({
    name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {

    constructor() {
        if (!window.hasOwnProperty('markdown')) {
            throw new Error('Markdown pipe requires the markdown library: https://github.com/evilstreak/markdown-js');
        }
    }

    transform(value: string, args?: any): any {
        return markdownToHtml(value);
    }
}
