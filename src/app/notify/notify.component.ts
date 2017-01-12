import {Component, OnInit} from '@angular/core';
import {ManagerService, Alert} from './manager.service';

@Component({
    selector: 'app-notify',
    templateUrl: './notify.component.html',
    styleUrls: ['./notify.component.css']
})
export class NotifyComponent implements OnInit {

    constructor(public service: ManagerService) {

    }

    ngOnInit() {
    }

    getAlertClass(alert: Alert) {

        return 'danger';
    }

}
