import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Package} from '../openscriptorium.service';
import {ExecuterService} from '../executer.service';


@Component({
    selector: 'ngbd-modal-content',
    providers: [ExecuterService],
    templateUrl: './package.modal.component.html'
})
export class PackageModalComponent {
    public pkg: Package;

    constructor(public activeModal: NgbActiveModal, private executer: ExecuterService) {
    }

    executePackage() {
        let proc = this.executer.execute(this.pkg.scripts[0].content);

        proc.stdout.on('data', (chunk) => {
            console.log(chunk);
        });
        proc.stderr.on('data', (chunk) => {
            console.error(chunk);
        });

        proc.on('exit', () => {
            console.log('end');
        });
    }
}
