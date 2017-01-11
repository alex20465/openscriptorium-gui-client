import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {
    Package, OpenscriptoriumService,
    Script
} from '../openscriptorium.service';
import {ExecuterService} from '../executer.service';
import {toString} from '@ng-bootstrap/ng-bootstrap/util/util';


@Component({
    selector: 'ngbd-modal-content',
    providers: [ExecuterService],
    templateUrl: './package.modal.component.html'
})
export class PackageModalComponent {
    public pkg: Package;

    constructor(public activeModal: NgbActiveModal, private executer: ExecuterService, private osService: OpenscriptoriumService) {
    }

    executePackage() {
        // todo: requires an latest script version picker using semver parser.
        // todo: check if pkg has a value and that a script is available.
        this.osService.getScriptData(this.pkg.scripts[0])
            .then((script) => {
                let process = this.executer.execute(
                    script.content, script.requires_superuser);

                process.stdout.on('data', (chunk) => {
                    console.debug(chunk.toString());
                });
                process.stderr.on('data', (chunk) => {
                    console.error(chunk);
                });
                process.on('exit', () => {
                    console.debug('command line execution finished');
                });
            });
    }
}
