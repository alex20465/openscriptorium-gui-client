import {Injectable, EventEmitter} from '@angular/core';
import {
    Package, Script,
    OpenscriptoriumService
} from '../openscriptorium.service';
import {Observable, Subject} from 'rxjs';
import {DeviceService, Device} from '../device.service';
import {createHash} from 'crypto';
import {ChildProcess} from 'child_process';


export enum ExecuteSubscriptionTypes {
    EXIT,
    STDERR,
    COMMAND,
    STDOUT
}
export interface ExecuteSubscriptionEntry {
    type: ExecuteSubscriptionTypes,
    data: string|Number
}

interface ObservableStreamEntry {
    stream: Subject<ExecuteSubscriptionEntry>;
    proc: Process;
}

export enum PROCESS_STATUS {
    FETCHING = <any>'fetching',
    RUNNING = <any>'running',
    FAILED = <any>'failed',
    SUCCESS = <any>'success',
    QUEUED = <any>'queued'
}

export enum TERMINAL_CHANNEL {
    STDERR = <any>'stderr',
    STDOUT = <any>'stdout'
}

export class TerminalLineOutput {
    constructor(public data: string|Number, public channel: TERMINAL_CHANNEL = TERMINAL_CHANNEL.STDOUT) {
    }
}

export class Process {
    private _status: PROCESS_STATUS;
    public eventStream: Subject<ExecuteSubscriptionEntry>;
    public lineOutputs: Array<TerminalLineOutput> = [];

    constructor(public pkg) {
        this._status = PROCESS_STATUS.QUEUED;
        this.eventStream = new Subject<ExecuteSubscriptionEntry>();
        this.eventStream.subscribe((entry: ExecuteSubscriptionEntry) => {
            switch (entry.type) {
                case (ExecuteSubscriptionTypes.STDOUT):
                    this.lineOutputs.push(new TerminalLineOutput(
                        entry.data, TERMINAL_CHANNEL.STDOUT));
                    break;
                case (ExecuteSubscriptionTypes.STDERR):
                    this.lineOutputs.push(new TerminalLineOutput(
                        entry.data, TERMINAL_CHANNEL.STDERR));
                    break;
            }
        });
    }

    public setStatus(status: PROCESS_STATUS) {
        this._status = status;
    }

    get status(): PROCESS_STATUS {
        return this._status;
    }
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
            let child_proc: ChildProcess;
            fs.writeFileSync('/tmp/openscript.sh', content);
            const procOptions = {};
            if (sudo) {
                child_proc = child_process.spawn(
                    'gksu', ['bash /tmp/openscript.sh'], procOptions);
            } else {
                child_proc = child_process.spawn(
                    'bash', ['/tmp/openscript.sh'], procOptions);
            }

            child_proc.stdin.on('data', (chunk) => {
                console.log(chunk);
            });

            child_proc.stderr.on('data', (chunk: Buffer) => {
                chunk.toString('utf8').split("\n").forEach(line => {
                    observer.next(<ExecuteSubscriptionEntry>{
                        type: ExecuteSubscriptionTypes.STDERR,
                        data: line
                    });
                });
            });

            child_proc.stdout.on('data', (chunk: Buffer) => {
                chunk.toString('utf8').split("\n").forEach(line => {
                    observer.next(<ExecuteSubscriptionEntry>{
                        type: ExecuteSubscriptionTypes.STDOUT,
                        data: line
                    });
                });
            });
            child_proc.on('exit', (exitCode: Number) => {
                observer.next(<ExecuteSubscriptionEntry>{
                    type: ExecuteSubscriptionTypes.EXIT,
                    data: exitCode
                });
                observer.complete();
            });
        });
    }
}

@Injectable()
export class ManagerService {
    public currentRunningProcess: Process = null;

    private _unfinishedQueue: Array<Process> = [];
    // todo: used it or remote it
    public finishedQueue: Array<Process> = [];
    private isProcessing: Boolean = false;
    private processEventStreams: Array<ObservableStreamEntry> = [];
    public processReadyEvent: EventEmitter<Package>;

    constructor(private osService: OpenscriptoriumService, private deviceService: DeviceService) {
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
        if (!this.isProcessing && this.unfinishedQueue.length && this.deviceService.isSupported()) {
            const proc = this._unfinishedQueue[0];
            const eventStream = proc.eventStream;
            const scriptSelector = new ScriptVersionSelector(proc.pkg);
            const script = scriptSelector.select();

            this.isProcessing = true;
            this.currentRunningProcess = proc;
            proc.setStatus(PROCESS_STATUS.FETCHING);


            this.osService.getScriptData(script)
                .then(script => {
                    proc.setStatus(PROCESS_STATUS.RUNNING);
                    (new BashExecuter()).execute(script.content, script.requires_superuser)
                        .subscribe((eventEntry) => {
                            eventStream.next(eventEntry);
                            if (eventEntry.type === ExecuteSubscriptionTypes.EXIT) {
                                if (eventEntry.data === 0) {
                                    proc.setStatus(PROCESS_STATUS.SUCCESS);
                                } else {
                                    proc.setStatus(PROCESS_STATUS.FAILED);
                                }
                                this.onProcessDone(proc);
                                this.process();
                            }
                        });
                });
        }
    }

    private onProcessDone(proc: Process) {
        this.isProcessing = false;
        this.currentRunningProcess = null;
        this.finishedQueue.unshift(this.unfinishedQueue.shift());
        if (proc.status === PROCESS_STATUS.FAILED) {
            proc.eventStream.error(new Error('Failed to process!'));
        }
        proc.eventStream.complete();
        this.processReadyEvent.next(proc.pkg);
    }

    private findPackageEventStream(proc: Process): Subject<ExecuteSubscriptionEntry> {
        return this.processEventStreams.filter(entry => {
            return entry.proc === proc;
        }).map(entry => {
            return entry.stream;
        }).pop();
    }

    public appendQueue(pkg: Package): Subject<ExecuteSubscriptionEntry> {
        const proc = new Process(pkg);
        const eventStream = new Subject<ExecuteSubscriptionEntry>();
        this.unfinishedQueue.push(proc);
        this.processEventStreams.push({
            stream: eventStream,
            proc: proc
        });
        this.process();
        return eventStream;
    }

    get unfinishedQueue(): Array<Process> {
        return this._unfinishedQueue;
    }
}
