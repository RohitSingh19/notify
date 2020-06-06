import { Component, OnInit} from '@angular/core';
import { Note } from './note/note.model';
import { NoteService } from './note.service';
import { User } from '../auth/user.model';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  notes: Note[];
  Object = Object;
  isNotesFound = false;
  addNewNote = true;
  noteTitle: string;
  isLoading = true;
  totalNotesCount: number;
  currentUser: User;
  notesCollection: any;
  currentUserId: string;

  constructor(private notesService: NoteService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isLoading = true;
    const uid = this.route.snapshot.paramMap.get('uid');
    if (uid) {
      this.currentUserId = uid;
      this.notesService.getAllNotes(uid)
        .subscribe((res: Note[]) => {
          this.notes = res;
          this.isLoading = false;
          this.isNotesFound = true;
      });
    }

    if (this.notesService.subsVar === undefined) {
      this.notesService.subsVar = this.notesService.invokeFirstComponentFunction.subscribe(() => {
        this.refreshNotes();
      });
    }
  }

  get_setTotalNotesCount(uid: string) {
    this.notesService.getNotesCount(uid)
      .subscribe((res: number) => {
        this.totalNotesCount = res;

        if (this.totalNotesCount > 0) {
          this.isNotesFound = true;
        } else {
          this.addNewNote = true;
          this.isNotesFound = false;
        }
      });
  }

  addNewNoteClickHandler() {
    this.noteTitle = '';
    this.addNewNote = false;
  }

  cancelNewNoteClickHandler() {
    this.addNewNote = true;
  }

  saveNewNote() {
    this.isLoading = true;
    let Title = this.noteTitle;
    Title === '' ? Title = 'NEW NOTE' : Title = this.noteTitle.trim().toUpperCase();
    const newNote = new Note(Title, this.currentUserId, '', '', false, new Date().toISOString(),
    new Date().toISOString());
    this.notesService.postData(newNote, `users/${this.currentUserId}/notes`)
    .subscribe(result => {
    });

    this.notesService.getAllNotes(this.currentUserId)
      .subscribe((res: Note[]) => {
        this.addNewNote = true;
        this.notes = res;
        this.isNotesFound = true;
        this.isLoading = false;
    });
  }


  public refreshNotes() {
    this.isLoading = true;
    const uid = this.route.snapshot.paramMap.get('uid');
    if (uid) {
      this.currentUserId = uid;
      this.notesService.getAllNotes(uid)
        .subscribe((res: Note[]) => {
          this.notes = res;
          this.isLoading = false;
          this.isNotesFound = true;
      });
    }
  }
}
