import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class DataStorageService {
    uid: string;
    fileUpload: File;
    db = firebase.database();

    constructor(private afDb: AngularFireDatabase) {}

    postData(body: any, collectionName: string): Observable<any> {
        return new Observable((observer) => {
            this.afDb.database.ref().child(`${collectionName}/${body.idToken}/`).set(body)
            .then((doc) => {
                console.log(doc);
            });
        });
    }

    uploadImageToFirebaseStorage(uid: string, file: File, dob: string, gender: string) {
        const path = `/profile_pics/${Date.now()}_${file.name}`;
        const storageRef = firebase.storage().ref();
        const uploadTask = storageRef.child(path).put(file);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
              // in progress
              const snap = snapshot as firebase.storage.UploadTaskSnapshot;
            },
            (error) => {
              // fail
              console.log(error);
            },
            () => {
              // success
              const urlObj = uploadTask.snapshot.ref.getDownloadURL();
              urlObj.then(url =>   {
                this.updateUserProfile(uid, url, dob, gender);
              });
            }
          );
    }

    updateUserProfile(uid: string, avatarUrl: string, dob: string, gender: string) {
      const update = {};
      const avatar = `/users/${uid}/avatarUrl`;
      update[avatar] = avatarUrl;
      const DOB = `/users/${uid}/dob`;
      update[DOB] = dob;
      const Gender = `/users/${uid}/gender`;
      update[Gender] = gender;
      this.db.ref().update(update);
    }
    // updateData(body: any, collectionName: string)
}
