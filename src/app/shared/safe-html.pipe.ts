import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'safeHtml'
})
export class SafeHTMLPipe implements PipeTransform {
    constructor() {}
    transform(value: any): any {
        return value.split('&lt;').join('<').split('&gt;').join('>');
    }
}
