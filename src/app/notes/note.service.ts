import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Note } from './note/note.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, tap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class NoteService {

    selectedNote = new EventEmitter<Note>();
    selectedNoteIndex = new EventEmitter<number>();
    private currentNoteIndexSub = new Subject();
    sub$ = this.currentNoteIndexSub.asObservable();

    items: Observable<Note[]>;
    baseUrl = environment.firebaseConfig.databaseURL;

    invokeFirstComponentFunction = new EventEmitter();
    subsVar: Subscription;

    constructor(private afDb: AngularFireDatabase,
                private http: HttpClient) { }


    sendNoteIndex(value: number) {
        this.currentNoteIndexSub.next(value);
    }

    onFirstComponentButtonClick() {
        this.invokeFirstComponentFunction.emit();
    }

    /*This function returns the total count of notes created by user.*/

    getNotesCount(userId: string): Observable<any> {
        return this.http
        .get(`${this.baseUrl}/users/${userId}/totalNotes.json`);
    }

    /*This function returns the total count of notes created by user.*/

    /*This function returns all the notes created by user*/

    getAllNotes(userId: string): Observable<Note[]> {
        return this.http
        .get<Note[]>(`${this.baseUrl}/users/${userId}/notes.json`);
    }
    /*This function returns all the notes created by user*/

    /*Get Current Note*/
    getCurrentNote(userId: string, noteId: string): Observable<Note> {
        return this.http
        .get<Note>(`${this.baseUrl}/users/${userId}/notes/${noteId}.json`);
    }


    saveNewNoteInDb(userId: string, body: Note) {
            const db = firebase.database().ref('users/' + userId + '/notes/').push();
            const key = db.key;
            const NoteData = {
                id: key,
                createdBy: body.createdBy,
                createdDate: body.createdDate,
                isBookmarked: body.isBookmarked,
                noteContentHtml: body.noteContentHtml,
                noteContentPlain: body.noteContentPlain,
                noteTitle: body.noteTitle,
                updatedDate: body.updatedDate
            };
            return db.set(NoteData);
    }

    postData(body: any, collectionName: string): Observable<any> {
        return new Observable((observer) => {
            this.afDb.database.ref().child(`${collectionName}`).push(body)
                .then((doc) => {
                });
        });
    }

    updateNote(noteContentPlain: string, noteContentHtml: string,
               updatedBy: string, updatedDate: string, noteId: string,
               noteTitle: string) {

                const newNote = new Note(noteTitle, updatedBy,
                                        noteContentPlain, noteContentHtml,
                                        false, updatedDate, updatedDate, noteId);

                const db = firebase.database();

                const finalUrl = `/users/${updatedBy}/notes/`;
                db.ref(finalUrl).child(noteId).set(newNote);
    }

    updateTotalNoteCount(noteCount: number, userId: string): number {
        const db = firebase.database();
        const update = {};
        const finalUrl = `/users/${userId}/totalNotes`;
        update[finalUrl] = noteCount;
        db.ref().update(update);
        return noteCount;
    }


    updateNoteTags(noteId: string, userId: string, tags: string[]) {
        const db = firebase.database();
        const update = {};
        const finalUrl = `/users/${userId}/notes/${noteId}/tags`;
        update[finalUrl] = tags;
        db.ref().update(update);
    }


    deleteNote(noteId: string, updatedBy: string) {
        const db = firebase.database();
        const finalUrl = `/users/${updatedBy}/notes/`;
        return db.ref(finalUrl).child(noteId).remove();
    }

    isBookmarked(userId: string, noteId: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/users/${userId}/notes/${noteId}/isBookmarked.json`);
    }

    updateBookmark(userId: string, noteId: string, status: boolean) {
        const db = firebase.database();
        const update = {};
        const finalUrl = `/users/${userId}/notes/${noteId}/isBookmarked`;
        update[finalUrl] = status;
        db.ref().update(update);
    }

    readBookmarks(userId: string, noteId: string): Observable<string[]> {
        return this.http
        .get<string[]>(`${this.baseUrl}/users/${userId}/notes/${noteId}/tags.json`);
    }
}
