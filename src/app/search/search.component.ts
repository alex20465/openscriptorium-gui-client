import {Component} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PackageModalComponent} from '../package/package.modal.component';
import {
    OpenscriptoriumService,
    PackageResult, Package
} from '../openscriptorium.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent {

    result: PackageResult;

    constructor(private service: OpenscriptoriumService, private modalService: NgbModal) {
    }

    onSearch(term: string) {
        this.service.search(term).subscribe((result) => {
            this.result = result;
        });
    }

    openModal(pkg: Package) {
        let ref = this.modalService.open(PackageModalComponent);
        ref.componentInstance.pkg = pkg;
    }
}
