import {Injectable} from '@angular/core';
import {ChildProcess} from 'child_process';
import * as fs from 'fs';
import * as child_process from 'child_process';

@Injectable()
export class ExecuterService {
    constructor() {
    }

    execute(content): ChildProcess {
        const fs = (<any>window).require('fs');
        const child_process = (<any>window).require('child_process');

        fs.writeFileSync('/tmp/openscript.sh', content);

        return child_process.exec('ls');
    }
}
