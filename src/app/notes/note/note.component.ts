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
    this.lastUpdatedDateNote = new Date(this.noteData.updatedDate);
  }

  onSelectedNote() {
    this.notesService.selectedNote.emit(this.note);
  }
}

