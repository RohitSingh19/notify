import { Injectable, EventEmitter } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ModalPopUpComponent } from './modal-popup.component';


@Injectable({
    providedIn: 'root'
})
export class ModalService {
    constructor(private modalService: NgbModal) {}
    closeResult = '';
    modal: any;
    public openModal(btnOkText: string = 'OK', btnCancelText: string = 'Cancel') {

    this.modal =  this.modalService.open(ModalPopUpComponent,
                      {ariaLabelledBy: 'modal-basic-title'});

    this.modal.componentInstance.title = '';
    this.modal.componentInstance.modalBody = '';
    this.modal.componentInstance.btnOkText = btnOkText;
    this.modal.componentInstance.btnCancelText = btnCancelText;
    return this.modal.result;
 }
    // open(content) {
    //     this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    //       this.closeResult = `Closed with: ${result}`;
    //     }, (reason) => {
    //       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    //     });
    //   }

    //   private getDismissReason(reason: any): string {
    //     if (reason === ModalDismissReasons.ESC) {
    //       return 'by pressing ESC';
    //     } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    //       return 'by clicking on a backdrop';
    //     } else {
    //       return `with: ${reason}`;
    //     }
    //   }
    close() {
        //this.modalService.dismissAll();
        this.modal.close();
    }
}
