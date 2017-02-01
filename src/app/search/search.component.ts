import {Component} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalComponent} from '../package/modal/modal.component';
import {
    OpenscriptoriumService,
    PackageResult, Package
} from '../openscriptorium.service';
import {ManagerService} from '../notify/manager.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent {

    result: PackageResult;

    isLoading: Boolean = false;

    constructor(private service: OpenscriptoriumService,
                private modalService: NgbModal, private notify: ManagerService) {
    }

    onSearch(term: string) {
        this.isLoading = true;
        this.service.search(term)
            .then((result) => {
                this.isLoading = false;
                this.result = result;
            })
            .catch((err) => {
                this.isLoading = false;
                this.notify.danger(
                    'search', `Search query failed!`);
            });
    }

    openModal(pkg: Package) {
        let ref = this.modalService.open(ModalComponent);
        ref.componentInstance.pkg = pkg;
    }
}
