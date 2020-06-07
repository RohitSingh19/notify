import { Component, OnInit} from '@angular/core';
import { Note } from './note/note.model';
import { NoteService } from './note.service';
import { User } from '../auth/user.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})

export class NotesComponent implements OnInit {

  notes: Note[];
  isNotesFound = false;
  addNewNote = true;
  noteTitle: string;
  isLoading = true;
  totalNotesCount: number;
  currentUser: User;
  currentUserId: string;
  ShowBookmarks = 'Show Bookmarks';

  constructor(private notesService: NoteService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isLoading = true;
    const uid = this.route.snapshot.paramMap.get('uid');
    if (uid) {
      this.showAllNotes();
    }

    if (this.notesService.subsVar === undefined) {
      this.notesService.subsVar = this.notesService.invokeFirstComponentFunction.subscribe(() => {
        this.showAllNotes();
      });
    }
  }

  toggleBookmarked() {
    this.isNotesFound = false;
    this.isLoading = true;
    if (this.ShowBookmarks === 'Show Bookmarks') {
      const Notes = this.notes;
      const noteArray: Note[] = [];
      for (const key in Notes) {
        if (Notes[key].isBookmarked) {
           noteArray.push(Notes[key]);
        }
      }
      this.notes = noteArray;
      this.ShowBookmarks = 'Show All Notes';
    } else {
      this.showAllNotes();
      this.ShowBookmarks = 'Show Bookmarks';
    }
    this.isNotesFound = true;
    this.isLoading = false;
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
    let Title = this.noteTitle;
    Title === '' ? Title = 'NEW NOTE' : Title = this.noteTitle.trim().toUpperCase();
    const newNote = new Note(Title, this.currentUserId, ' ', ' ', false, new Date().toISOString(),
    new Date().toISOString());
    this.notesService.saveNewNoteInDb(this.currentUserId, newNote)
        .then(() => {
          this.showAllNotes();
          this.addNewNote = true;
        });
  }


  showAllNotes() {
    this.isLoading = true;
    this.isNotesFound = false;
    const uid = this.route.snapshot.paramMap.get('uid');
    if (uid) {
      this.currentUserId = uid;
      let count = 0;
      this.notesService.getAllNotes(uid)
        .subscribe((res: Note[]) => {
          const Notes = res;
          const noteArray: Note[] = [];
          for (const key in Notes) {
            if (Notes[key]) {
              noteArray.push(Notes[key]);
              count++;
            }
          }
          this.totalNotesCount = count;
          this.notes = noteArray;
          this.isLoading = false;
          this.isNotesFound = true;
        });
    }
  }
}
