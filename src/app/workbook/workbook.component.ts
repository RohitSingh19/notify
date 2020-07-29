import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NoteService } from '../notes/note.service';
import { Note } from '../notes/note/note.model';
import {fromEvent, Subscription} from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { LoadingBarService } from '@ngx-loading-bar/core';

import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/font_family.min.js';
import 'froala-editor/js/plugins/emoticons.min.js';
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/./js/plugins/print.min.js';
import 'froala-editor/./js/plugins/link.min.js';
// import 'froala-editor/./js/plugins/image.min.js';
import 'froala-editor/./js/plugins/quote.min.js';
import 'froala-editor/./js/plugins/align.min.js';
import { AuthService } from '../auth/auth-service';
import { User } from '../auth/user.model';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-workbook',
  templateUrl: './workbook.component.html',
  styleUrls: ['./workbook.component.css']
})
export class WorkbookComponent implements OnInit, AfterViewInit {

  
  selectedNote: Note;
  updatedBy: string;
  updatedDate: string;
  userId: string;
  noteId: string;
  selectedNoteTitle: string;
  editorContent: string;
  @ViewChild('InputText', {static: false}) froalTextInput: ElementRef;
  @ViewChild('InputTextNoteTitle', {static: false}) InputTextNoteTitle: ElementRef;


  public options: object = {
    placeholderText: 'Type something here.',
    pluginsEnabled: ['image', 'link', 'colors'],
    height: 300,
    events : {
      'keyup' (keyupEvent) {
        const froala = this;
      }
    }
  };

  ngAfterViewInit() {
    fromEvent(this.froalTextInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.innerHTML;
      }), debounceTime(2000)
    ).subscribe((text: string) => {
      this.updateNote(this.editorContent,
         text, this.noteId, this.selectedNote.noteTitle);
    }, (err) => {
      alert(err);
    });
  }

  constructor(private noteService: NoteService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private loader: LoadingBarService) {}



  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.noteId = params['noteId'];
        const user: User = this.authService.getCurrentUserFromLocalStorage();
        if (user && this.noteId) {
          this.updatedBy = user.localId;
          this.noteService.getCurrentNote(user.localId, this.noteId)
                          .subscribe((note: Note) => {
                          this.selectedNote = note;
                          this.editorContent = this.selectedNote.noteContentHtml;
                          this.selectedNoteTitle = this.selectedNote.noteTitle;
                          setTimeout(() => { // this will make the execution after the above boolean has changed
                            this.InputTextNoteTitle.nativeElement.focus();
                          }, 10);
                  });
        }
      }
    );
    this.noteService.selectedNote.subscribe((note: Note) => {
      this.selectedNote = note['value'];
      this.noteId = note['key'];
      this.editorContent = this.selectedNote.noteContentPlain;
    });
  }

  transform(value: any): any {
    return value.split('&lt;').join('<').split('&gt;').join('>');
  }

  updateNote(noteContentPlain: string, notContentHtml: string,
             noteId: string, noteTitle: string) {
    this.loader.start();
    this.updatedDate = new Date().toISOString();
    noteContentPlain = noteContentPlain.replace('Powered by Froala Editor', '');
    noteContentPlain = noteContentPlain.replace(/<[^>]*>/g, '');
    this.noteService.updateNote(noteContentPlain, notContentHtml,
    this.updatedBy, this.updatedDate, noteId, noteTitle)
    .then(() => this.loader.complete());
  }
}

