import { Injectable } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ModalPopUpComponent } from './modal-popup.component';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    constructor(private modalService: NgbModal) {}
    closeResult = '';

   public openModal(btnOkText: string = 'OK', btnCancelText: string = 'Cancel') {
    const modalRef =  this.modalService.open(ModalPopUpComponent,
                      {ariaLabelledBy: 'modal-basic-title'});

    modalRef.componentInstance.title = '';
    modalRef.componentInstance.modalBody = '';
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
}

    open(content) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }

      private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
          return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          return 'by clicking on a backdrop';
        } else {
          return `with: ${reason}`;
        }
      }
    close() {
        this.modalService.dismissAll();
    }
}
