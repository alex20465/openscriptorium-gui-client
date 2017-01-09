import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchComponent} from './search.component';
import {MarkdownPipe} from '../markdown.pipe';
import {
    PackageModalComponent
} from '../package/package.modal.component';

@NgModule({
    imports: [
        CommonModule
    ],
    entryComponents: [
        PackageModalComponent
    ],
    declarations: [
        PackageModalComponent,
        SearchComponent,
        MarkdownPipe
    ]
})
export class SearchModule {

}
