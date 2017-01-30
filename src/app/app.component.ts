import {Component, ApplicationRef} from '@angular/core';
import {DeviceService} from './device.service';
import {ManagerService} from './notify/manager.service';
import {ManagerService as RunnerManagerService} from './runner/manager.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(public deviceService: DeviceService,
                private alertService: ManagerService,
                public runner: RunnerManagerService,
                private ref: ApplicationRef) {

        if (!deviceService.isSupported()) {
            alertService.warning('Support', `Your device is currently not supported by openscriptorium.`);
        }

        runner.processReadyEvent.subscribe(pkg => {
            ref.tick();
        });
    }

    public close() {
        window.close();
    }
}
