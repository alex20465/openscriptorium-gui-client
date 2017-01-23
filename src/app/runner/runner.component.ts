import {Component} from '@angular/core';
import {ManagerService, Process} from './manager.service';


@Component({
    selector: 'app-runner',
    templateUrl: './runner.component.html',
    styleUrls: ['./runner.component.css'],
    host: {
        'class': 'flex-container-column flex-item-fill'
    }
})
export class RunnerComponent {

    public selectedProcess: Process = null;

    constructor(public runner: ManagerService) {
        if (this.runner.currentRunningProcess) {
            this.selectProcess(this.runner.currentRunningProcess);
        } else if (this.runner.finishedQueue.length) {
            this.selectProcess(this.runner.finishedQueue[0]);
        } else if (this.runner.unfinishedQueue.length) {
            this.selectProcess(this.runner.unfinishedQueue[0]);
        }
    }

    selectProcess(proc: Process) {
        this.selectedProcess = proc;
    }

    hasItems() {
        return !!(this.runner.unfinishedQueue.length || this.runner.finishedQueue.length);
    }

    getItems() {
        return this.runner.unfinishedQueue.concat(this.runner.finishedQueue);
    }
}
