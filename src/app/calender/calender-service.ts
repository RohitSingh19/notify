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


    saveCalenderNoteInDb(userId: string, event: string, eventId: string,  eventDate: string,
                         eventColor: string, eventUpdateDate: string) {
        const db = firebase.database().ref('users/' + userId).child('calendarNotes').child(eventId);
        // const db = firebase.database().ref('users/' + userId + '/calenderNotes/' + eventId).push();
        const data = {
            id: eventId,
            note: event,
            noteDate: eventDate,
            noteColor: eventColor,
            lastUpdate: eventUpdateDate,
            createdBy: userId
        };
        return db.set(data);
        // return firebase.firestore()
        //        .collection('CalendarNote').doc(eventId).set(data);
    }


    getAllCalenderNotes(userId: string): Observable<CalendarEvent[]> {
        return this.http
            .get<CalendarEvent[]>(`${this.baseUrl}/users/${userId}/calendarNotes.json`);
    }

    updateCalenderNote(userId: string, eventId: string, event: string, color: string) {
        const db = firebase.database();
        const update = {};
        const eventTitle = `/users/${userId}/calendarNotes/${eventId}/note`;
        update[eventTitle] = event;
        const eventColor = `/users/${userId}/calendarNotes/${eventId}/noteColor`;
        update[eventColor] = color;
        return db.ref().update(update);
    }

}
