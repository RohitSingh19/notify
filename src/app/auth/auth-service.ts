import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, Observable } from 'rxjs';
import { User } from './user.model';
import {environment} from '../../environments/environment';
import { AngularFireDatabase } from '@angular/fire/database';


export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user = new Subject<User>();
    FIREBASE_KEY: string = environment.firebaseConfig.apiKey;
    FIREBASE_BASE_URL = environment.firebaseBaseUrl;

    constructor(private httpClient: HttpClient,
                private afDb: AngularFireDatabase) { }

    signUp(EMAIL: string, PASSWORD: string, NAME: string) {
        return this.httpClient
            .post<AuthResponseData>(this.FIREBASE_BASE_URL + 'signUp?key=' + this.FIREBASE_KEY,
                {
                    email: EMAIL,
                    password: PASSWORD,
                    returnSecureToken: true
                }).pipe(catchError(this.handleError), tap((resData) => {
                    this.handleAuthentication(resData.email,
                        resData.localId,
                        resData.refreshToken,
                        +resData.expiresIn,
                        NAME);
                }));
    }

    login(EMAIL: string, PASSWORD: string) {
        return this.httpClient
        .post(this.FIREBASE_BASE_URL + 'signInWithPassword?key=' + this.FIREBASE_KEY, {
          email: EMAIL, password: PASSWORD, returnSecureToken: true
         }).pipe(catchError(this.handleError),
             tap((resData: User) => {
                 this.saveUserDataToLocalStorage(resData);
         }));
    }

    private handleAuthentication(email: string, token: string, refreshToken: string,
                                 expiresIn: number, name: string) {

        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const userProfile = new User(email, token, refreshToken,
                                 expirationDate, name, '', '', '', true, 0);

        this.saveUserData(userProfile).subscribe((res) => {
            console.log(res);
        });
        
        this.saveUserDataToLocalStorage(userProfile);
    }

    saveUserData(user: User): Observable<any> {
        return new Observable((observer) => {
            this.afDb.database.ref().child(`users/${user.localId}`).set(user);
        });
    }

    saveUserDataToLocalStorage(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    getCurrentUserFromDB(userId: string): Observable<User> {
        return this.httpClient.
        get<User>(`https://notify-6f104.firebaseio.com/users/${userId}.json`);
    }


    autoLogin(): boolean {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            return true;
        } else {
            return false;
        }
    }

    getCurrentUserFromLocalStorage(): User {
        const user = JSON.parse(localStorage.getItem('user'));
        return user;
    }

    private handleError(errorMsg: HttpErrorResponse) {
        let errorMessage = 'An unknown error has occurred';
        if (!errorMsg.error || !errorMsg.error.error) {
            return throwError(errorMsg);
        }
        switch (errorMsg.error.error.message) {
            case 'EMAIL_EXISTS':  //sign up error
                errorMessage = 'The email address is already in use by another account';
                break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':   //sign up error
                errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later';
                break;
            case 'EMAIL_NOT_FOUND':   //login error
                errorMessage = 'Sorry! This email address is not registered with us.';
                break;
            case 'INVALID_PASSWORD':   //login error
                errorMessage = 'The password is invalid.';
                break;
            case 'USER_DISABLED':   //login error
                errorMessage = 'The user account has been disabled by an administrator..';
                break;
        }
        return throwError(errorMessage);
    }
}














//     login(email: string, password: string): Observable<any> {
    //     return from (
    //         this.firebaseAuth.auth
    //         .signInWithEmailAndPassword(email, password))
    //        .pipe(
    //         map(credential => credential.user),
    //         tap(user => {
    //           console.log('signed in with email and password succesfully, user:', user);
    //         }),
    //         catchError((error, obs) => {
    //           console.error('signin with email and password failed, error:', error);
    //           return obs;
    //         })
    //       );
    //   }


    // login(EMAIL: string, PASSWORD: string): Observable<UserProfile> {
    //     return new Observable<UserProfile>((observer) => {
    //         this.firebaseAuth
    //             .auth
    //             .signInWithEmailAndPassword(EMAIL, PASSWORD);
    //     }).pipe(catchError(this.handleError), tap(data => {
    //         console.log(data);
    //     }));

    // }