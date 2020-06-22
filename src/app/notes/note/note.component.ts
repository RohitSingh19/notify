import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Note } from './note.model';
import { NoteService } from '../note.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {


  @Input() note: Note;
  @Input() index: number;
  @Input() noteIndex: number;
  noteData: Note;
  lastUpdatedDateNote: Date;

  constructor(private notesService: NoteService) { }

  ngOnInit(): void {
    this.noteData = this.note['value'];
    // Powered by Froala Editor
    this.noteData.noteContentPlain.replace('Powered by Froala Editor', '');
    if (this.noteData.noteContentPlain.length > 20) {
         // tslint:disable-next-line: no-unused-expression
         this.noteData.noteContentPlain = this.noteData.noteContentPlain.substring(0, 19) + '...';
    }
    this.lastUpdatedDateNote = new Date(this.noteData.updatedDate);
  }

  onSelectedNote() {
    this.notesService.selectedNote.emit(this.note);
  }
}

