import { Component, OnInit } from '@angular/core';
import { NoteService } from '../notes/note.service';
import { User } from '../auth/user.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth/auth-service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { find, pull } from 'lodash';
import { ConfirmationDialogServiceService } from '../shared/confirmation-dialog/confirmation-dialog-service.service';
import { ToastrService } from 'ngx-toastr';


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
  // @ViewChild('tagInput') tagInputRef: ElementRef;
  tags: string[] = [];
  form: FormGroup;
  AddTagFlag = false;

  constructor(private notesService: NoteService, private route: ActivatedRoute,
              private authService: AuthService, private toaster: ToastrService,
              private fb: FormBuilder, private router: Router,
              private confirmationDialogService: ConfirmationDialogServiceService) { }


  ngOnInit(): void {
    this.form = this.fb.group({
      tag: [undefined],
    });
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

    this.notesService.updateBookmark(this.user.localId, this.currentNoteId,bookmark);
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

  focusTagInput(): void {
    // this.tagInputRef.nativeElement.focus();
  }

  sendNoteAsWhatsAppMsg() {
      const userId = this.user.localId;
      this.notesService.sendNoteContentAsWhatsAppMessageWeb(userId, this.currentNoteId);
  }
  moveup() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
