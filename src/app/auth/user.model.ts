import { Note } from '../notes/note/note.model';

export class User {
    email: string;
    localId: string;
    refreshToken: string;
    tokenExpirationDate: Date;
    name: string;
    gender: string;
    avatarUrl: string;
    dob: string;
    isActive: boolean;
    totalNotes: number;
    notes: Note;

    constructor(email: string, localId: string, refreshToken: string,
                tokenExpirationDate: Date, name: string, gender: string,
                avatarUrl: string, dob: string, isActive: boolean, totalNotes: number)
    {
        this.email = email;
        this.localId = localId;
        this.refreshToken = refreshToken;
        this.tokenExpirationDate = tokenExpirationDate;
        this.name = name;
        this.gender = gender;
        this.avatarUrl = avatarUrl;
        this.dob = dob;
        this.isActive = isActive;
        this.totalNotes = totalNotes;
        this.notes = null;
    }
    //     get token() {
    //     if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
    //         return null;
    //     }
    //     return this._token;
    // }
}





