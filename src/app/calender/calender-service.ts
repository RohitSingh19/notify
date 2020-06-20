import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CalendarEvent } from './calendar-events-model';

@Injectable({
    providedIn: 'root'
})
export class CalenderService {

    baseUrl = environment.firebaseConfig.databaseURL;
    constructor(private http: HttpClient) { }


    saveCalenderNoteInDb(userId: string, event: string, eventDate: string,
                         eventColor: string, eventUpdateDate: string) {
        const db = firebase.database().ref('users/' + userId + '/calenderNotes/').push();
        const key = db.key;
        const data = {
            id: key,
            note: event,
            noteDate: eventDate,
            noteColor: eventColor,
            lastUpdate: eventUpdateDate,
            createdBy: userId
        };
        return db.set(data);
    }


    getAllCalenderNotes(userId: string): Observable<CalendarEvent[]> {
        return this.http
            .get<CalendarEvent[]>(`${this.baseUrl}/users/${userId}/calenderNotes.json`);
    }

    updateCalenderNote(userId: string, eventId: string, event: string, color: string) {
        const db = firebase.database();
        const update = {};
        const eventTitle = `/users/${userId}/calenderNotes/${eventId}/note`;
        update[eventTitle] = event;
        const eventColor = `/users/${userId}/calenderNotes/${eventId}/noteColor`;
        update[eventColor] = color;
        return db.ref().update(update);
    }

}
