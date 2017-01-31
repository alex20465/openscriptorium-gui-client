import {Component, ApplicationRef} from '@angular/core';
import {
    ManagerService, Process,
    ExecuteSubscriptionEntry
} from './manager.service';
import {Subject, Subscription} from 'rxjs';


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
    private selectedSubscriber: Subscription = null;

    constructor(public runner: ManagerService, private appRef: ApplicationRef) {
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

        if (this.selectedSubscriber !== null) {
            this.selectedSubscriber.unsubscribe();
        }

        this.selectedSubscriber = proc.eventStream
            .subscribe((entry: ExecuteSubscriptionEntry) => {
                this.appRef.tick();
            });
    }

    hasItems() {
        return !!(this.runner.unfinishedQueue.length || this.runner.finishedQueue.length);
    }

    getItems() {
        return this.runner.unfinishedQueue.concat(this.runner.finishedQueue);
    }
}
