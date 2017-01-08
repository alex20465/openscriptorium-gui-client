import {Component} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Package} from '../openscriptorium.service';
import {ExecuterService} from '../executer.service';


@Component({
    selector: 'ngbd-modal-content',
    providers: [ExecuterService],
    template: `
    <div class="modal-header">
        <button type="button" class="close" aria-label="Close" (click)="activeModal.close()">
            <span aria-hidden="true">&times;</span>
        </button>
        <h4 class="modal-title">Package: {{pkg.name}}</h4>
    </div>
    <div class="modal-body">
        
    </div>
    <div class="modal-footer">
        <button (click)="executePackage()" class="btn btn-success">Execute</button>
        <button (click)="activeModal.close()" type="button" class="btn btn-secondary">Close</button>
    </div>
`
})
export class ModalContent {
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
