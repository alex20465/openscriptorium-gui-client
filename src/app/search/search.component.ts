import {Component, OnInit} from '@angular/core';
import {
    OpenscriptoriumService,
    PackageResult, Package
} from '../openscriptorium.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalContent} from './modal.component';

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
        let ref = this.modalService.open(ModalContent);
        ref.componentInstance.pkg = pkg;
    }
}
