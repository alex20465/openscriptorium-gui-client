import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ManagerService} from './manager.service';
import {NotifyComponent} from './notify.component';
import {AlertClassPipe} from './alert-class.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        ManagerService,
    ],
    exports: [
      NotifyComponent,
    ],
    declarations: [
        AlertClassPipe,
        NotifyComponent
    ]
})
export class NotifyModule {
}
