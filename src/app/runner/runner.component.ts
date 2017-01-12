import {Component} from '@angular/core';
import {ManagerService} from './manager.service';

@Component({
    selector: 'app-runner',
    templateUrl: './runner.component.html',
    styleUrls: ['./runner.component.css']
})
export class RunnerComponent {
    constructor(public runner: ManagerService) {
    }
}
