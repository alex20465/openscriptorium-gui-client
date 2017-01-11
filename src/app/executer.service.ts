import {Injectable} from '@angular/core';
import {ChildProcess} from 'child_process';
import * as fs from 'fs';
import * as child_process from 'child_process';

@Injectable()
export class ExecuterService {
    constructor() {
    }

    execute(content: string, sudo: boolean = false): ChildProcess {
        const fs = (<any>window).require('fs');
        const child_process = (<any>window).require('child_process');

        fs.writeFileSync('/tmp/openscript.sh', content);

        if (sudo) {
            return child_process.exec('gksu "bash /tmp/openscript.sh"');
        } else {
            return child_process.exec('bash /tmp/openscript.sh');
        }
    }
}
