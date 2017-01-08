import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalContent} from './modal.component';
import {SearchComponent} from './search.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    entryComponents: [
        ModalContent
    ],
    declarations: [
        ModalContent,
        SearchComponent
    ]
})
export class SearchModule {

}
