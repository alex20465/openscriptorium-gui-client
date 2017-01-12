import {Injectable} from '@angular/core';

@Injectable()
export class ElectronService {

    // todo: Module declaration
    private mElectron: any;

    constructor() {
        this.mElectron = (<any>window).require('electron').remote;

    }
}
