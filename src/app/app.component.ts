import {Component, ApplicationRef} from '@angular/core';
import {DeviceService, DeviceSupportEvaluator} from './device.service';
import {ManagerService} from './notify/manager.service';
import {ManagerService as RunnerManagerService} from './runner/manager.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [DeviceService],
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(public deviceService: DeviceService,
                private alertService: ManagerService,
                public runner: RunnerManagerService,
                private ref: ApplicationRef) {

        const device = this.deviceService.getDevice();
        const supportEvaluator = new DeviceSupportEvaluator(device);

        if (!supportEvaluator.isSupported()) {
            alertService.warning('Support', `Your device <strong>${device.platform}</strong> is currently not supported by openscriptorium.`);
        }

        runner.processReadyEvent.subscribe(pkg => {
            ref.tick();
        });
    }
}
