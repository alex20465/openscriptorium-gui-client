import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchComponent} from './search.component';
import {MarkdownPipe} from '../markdown.pipe';
import {
    ModalComponent
} from '../package/modal/modal.component';

@NgModule({
    imports: [
        CommonModule
    ],
    entryComponents: [
        ModalComponent
    ],
    declarations: [
        ModalComponent,
        SearchComponent,
        MarkdownPipe
    ]
})
export class SearchModule {
}
