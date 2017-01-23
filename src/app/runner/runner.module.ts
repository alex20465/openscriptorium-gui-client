import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeviceService} from '../device.service';
import {ManagerService} from './manager.service';
import {StatusLabelPipe} from './status-label.pipe';
import {RunnerComponent} from './runner.component';
import {NgbTooltip, NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule, NgbModule
    ],
    providers: [ManagerService, DeviceService],
    declarations: [StatusLabelPipe, RunnerComponent]
})
export class RunnerModule {
}
