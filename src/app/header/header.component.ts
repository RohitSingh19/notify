import { Component, OnInit } from '@angular/core';
import { NoteService } from '../notes/note.service';
import { User } from '../auth/user.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth/auth-service';
import { FormBuilder } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogServiceService } from '../shared/confirmation-dialog/confirmation-dialog-service.service';
import { ToastrService } from 'ngx-toastr';
import { Note } from '../notes/note/note.model';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  bookmarkToolTip: string;
  user: User;
  currentNoteId: string;
  noteBookmark: boolean;
  noteTitle: string;
  bookmark: string;
  createDate: string;
  lastUpdateDate: string;

  constructor(private notesService: NoteService, private route: ActivatedRoute,
              private authService: AuthService, private toaster: ToastrService,
              private router: Router, config: NgbModalConfig,
              private confirmationDialogService: ConfirmationDialogServiceService,
              private modalService: NgbModal) {
            config.backdrop = 'static';
            config.keyboard = false;
              }


  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.currentNoteId = params['noteId'];
        this.user = this.authService.getCurrentUserFromLocalStorage();
        this.IsNoteBookMarked(this.currentNoteId, this.user.localId);
      });
  }

  IsNoteBookMarked(noteId, userId) {
    this.notesService.isBookmarked(userId, noteId)
      .subscribe((res: boolean) => {
        this.noteBookmark = res;
        if (this.noteBookmark) {
          this.bookmarkToolTip = 'Remove Bookmark';
        } else {
          this.bookmarkToolTip = 'Add Bookmark';
        }
      });
  }

  toggleBookmark() {

    const bookmark = !this.noteBookmark;

    this.notesService.updateBookmark(this.user.localId, this.currentNoteId, bookmark);
    if (bookmark) {
      this.toaster.info('Note saved to bookmark', 'Notify!');
    } else {
      this.toaster.info('Note removed from bookmark', 'Notify!');
    }
    this.IsNoteBookMarked(this.currentNoteId, this.user.localId);
  }

  DeleteNote() {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete this note?')
    .then((confirmed) => {
      if (confirmed) {
         this.notesService.deleteNote(this.currentNoteId, this.user.localId)
         .then(() => {
          this.notesService.onFirstComponentButtonClick();
          this.router.navigate(['/home', this.user.localId]);
         });
      }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

 
  sendNoteAsWhatsAppMsg() {
      const userId = this.user.localId;
      this.notesService.sendNoteContentAsWhatsAppMessageWeb(userId, this.currentNoteId);
  }

  showNoteInfo(content) {
    this.notesService.getCurrentNote(this.user.localId, this.currentNoteId)
    .subscribe((response: Note) => {
        this.noteTitle = response.noteTitle;
        this.bookmark = (response.isBookmarked ? 'Yes' : 'No');
        this.createDate = response.createdDate;
        this.lastUpdateDate  = response.updatedDate;
    });
    this.modalService.open(content);
  }
  moveup() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
