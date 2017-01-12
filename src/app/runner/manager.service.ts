import {Injectable, EventEmitter} from '@angular/core';
import {
    Package, Script,
    OpenscriptoriumService
} from '../openscriptorium.service';
import {Observable, Subject} from 'rxjs';

export enum ExecuteSubscriptionTypes {
    EXIT,
    STDERR,
    STDOUT
}
export interface ExecuteSubscriptionEntry {
    type: ExecuteSubscriptionTypes,
    data: string
}

interface ObservableStreamEntry {
    stream: Subject<ExecuteSubscriptionEntry>;
    pkg: Package;
}

class ScriptVersionSelector {
    private m: any;

    constructor(private pkg: Package) {
        this.m = (<any>window).require('semver');
    }

    select(): Script {
        let selected: Script = null;
        this.pkg.scripts.forEach(script => {
            if (selected === null || this.m.lt(selected.version, script.version)) {
                selected = script;
            }
        });
        return selected;
    }
}

class BashExecuter {

    execute(content: string, sudo: boolean = false): Observable<ExecuteSubscriptionEntry> {

        // todo: find module declaration solution
        const fs = (<any>window).require('fs');
        const child_process = (<any>window).require('child_process');

        return new Observable(observer => {
            let process;
            fs.writeFileSync('/tmp/openscript.sh', content);
            if (sudo) {
                process = child_process.exec('gksu "bash /tmp/openscript.sh"');
            } else {
                process = child_process.exec('bash /tmp/openscript.sh');
            }

            process.stdout.on('data', chunk => {
                observer.next(<ExecuteSubscriptionEntry>{
                    type: ExecuteSubscriptionTypes.STDOUT,
                    data: chunk
                });
            });
            process.stderr.on('data', chunk => {
                observer.next(<ExecuteSubscriptionEntry>{
                    type: ExecuteSubscriptionTypes.STDERR,
                    data: chunk
                });
            });
            process.on('exit', () => {
                observer.next(<ExecuteSubscriptionEntry>{
                    type: ExecuteSubscriptionTypes.EXIT,
                    data: null
                });
                observer.complete();
            });
        });
    }
}

@Injectable()
export class ManagerService {
    public currentRunningPackage: Package = null;

    private _unfinishedQueue: Array<Package> = [];
    // todo: used it or remote it
    private finishedQueue: Array<Package> = [];
    private isProcessing: Boolean = false;
    private processEventStreams: Array<ObservableStreamEntry> = [];
    public processReadyEvent: EventEmitter<Package>;

    constructor(private osService: OpenscriptoriumService) {
        this.processReadyEvent = new EventEmitter<Package>();
    }

    public count(): Number {
        let num = this._unfinishedQueue.length;
        if (this.isProcessing) {
            num++;
        }
        return num;
    }

    private process() {
        if (!this.isProcessing && this._unfinishedQueue.length) {
            const pkg = this._unfinishedQueue.pop();
            const eventStream = this.findPackageEventStream(pkg);
            const scriptSelector = new ScriptVersionSelector(pkg);
            const script = scriptSelector.select();

            this.isProcessing = true;
            this.currentRunningPackage = pkg;

            this.osService.getScriptData(script)
                .then(script => {
                    (new BashExecuter()).execute(script.content, script.requires_superuser)
                        .subscribe((eventEntry) => {
                            eventStream.next(eventEntry);
                            if (eventEntry.type === ExecuteSubscriptionTypes.EXIT) {
                                this.isProcessing = false;
                                this.currentRunningPackage = null;
                                eventStream.complete();
                                this.processReadyEvent.next(pkg);
                                this.process();
                            }
                        });
                })
                .catch(err => {
                    this.isProcessing = false;
                    this.currentRunningPackage = null;
                    this.process();
                    eventStream.error(err);
                });
        }
    }

    private findPackageEventStream(pkg: Package): Subject<ExecuteSubscriptionEntry> {
        return this.processEventStreams.filter(entry => {
            return entry.pkg === pkg;
        }).map(entry => {
            return entry.stream;
        }).pop();
    }

    public appendQueue(pkg: Package): Subject<ExecuteSubscriptionEntry> {
        this._unfinishedQueue.push(pkg);
        const eventStream = new Subject<ExecuteSubscriptionEntry>();
        this.processEventStreams.push({
            stream: eventStream,
            pkg: pkg
        });
        this.process();
        return eventStream;
    }

    get unfinishedQueue(): Array<Package> {
        return this._unfinishedQueue;
    }
}
