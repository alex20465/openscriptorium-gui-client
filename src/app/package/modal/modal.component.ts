import {Component, ApplicationRef} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Package} from '../../openscriptorium.service';
import {
    ManagerService,
    ExecuteSubscriptionEntry, ExecuteSubscriptionTypes
} from '../../runner/manager.service';
import {Observable} from 'rxjs';


@Component({
    selector: 'ngbd-modal-content',
    templateUrl: './modal.component.html'
})
export class ModalComponent {
    public pkg: Package;

    constructor(public activeModal: NgbActiveModal, private runner: ManagerService) {
    }

    run() {
        this.runner.appendQueue(this.pkg)
            .catch(err => {
                return Observable.throw(err);
            })
            .subscribe(entry => {
                switch (entry.type) {
                    case(ExecuteSubscriptionTypes.STDOUT):
                        console.debug(entry.data);
                        break;
                    case(ExecuteSubscriptionTypes.STDERR):
                        console.error(entry.data);
                        break;
                    case(ExecuteSubscriptionTypes.EXIT):

                        console.log('command done');
                        break;
                }
            });
        this.activeModal.close();
    }

    //executePackage() {
    //    // todo: requires an latest script version picker using semver parser.
    //    // todo: check if pkg has a value and that a script is available.
    //    this.osService.getScriptData(this.pkg.scripts[0])
    //        .then((script) => {
    //            let process = this.executer.execute(
    //                script.content, script.requires_superuser);
    //
    //            process.stdout.on('data', (data) => {
    //                console.debug(data.toString());
    //            });
    //            process.stderr.on('data', (data) => {
    //                console.error(data);
    //            });
    //            process.on('exit', () => {
    //                console.debug('command line execution finished');
    //            });
    //        });
    //}
}
