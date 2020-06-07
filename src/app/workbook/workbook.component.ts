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

  rawHtml = 'a';
  selectedNote: Note;
  updatedBy: string;
  updatedDate: string;
  userId: string;
  noteId: string;
  notesIndexSubscription: Subscription;
  selectedNoteTitle: string;
  @ViewChild('InputText', {static: false}) froalTextInput: ElementRef;
  @ViewChild('InputTextTEST', {static: false}) InputTextTEST: ElementRef;
  

  public options: object = {
    placeholderText: 'Type something here.',
    pluginsEnabled: ['image', 'link', 'colors'],
    height: 300,
    events : {
      'keyup': function (keyupEvent) {
        // Do something here.
        // this is the editor instance.
        const froala = this;
        // console.log(froala.html.get());
      }
    }
  };
  ngAfterViewInit() {
    fromEvent(this.froalTextInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.innerHTML;
      }), debounceTime(2000)
    ).subscribe((text: string) => {
      console.log(this.selectedNote);
      this.updateNote(this.editorContent,
         text, this.noteId, this.selectedNote.noteTitle);
    }, (err) => {
      console.log(err);
    });
  }

  constructor(private noteService: NoteService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private loader: LoadingBarService) {

              this.notesIndexSubscription = noteService.sub$.subscribe(val => console.log(val));
              }

  editorContent: string;

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
                            this.InputTextTEST.nativeElement.focus();
                          }, 100);
                  });
        };
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

  onFroalaModelChanged(event: any) {
    setTimeout(() => {
      this.rawHtml = event;
      console.log(this.rawHtml);
    });
  }


  updateDOM(value: string) {
    this.rawHtml = value;
    console.log(this.rawHtml);
  }

  updateNote(noteContentPlain: string, notContentHtml: string,
             noteId: string, noteTitle: string) {
    this.loader.start();
    this.updatedDate = new Date().toISOString();
    noteContentPlain = noteContentPlain.replace(/<[^>]*>/g, '');
    this.noteService.updateNote(noteContentPlain, notContentHtml,
    this.updatedBy, this.updatedDate, noteId, noteTitle);
    this.loader.complete();
  }

}

