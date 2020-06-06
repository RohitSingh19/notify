import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataStorageService } from 'src/app/shared/data-storage-service';
import { ActivatedRoute } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AuthService } from '../auth-service';
import { User } from '../user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  currentUser: User;

  constructor(private dataStorage: DataStorageService,
              private route: ActivatedRoute, private loader: LoadingBarService,
              private authService: AuthService, private toastr: ToastrService) { }

  options = ['Male', 'Female'];
  optionSelected: any;
  imageFile: File;
  userId: string;
  userName: string;
  userEmail: string;
  submitting: boolean;

  ngOnInit(): void {
    this.fetchUser();
  }

  fetchUser() {
    this.currentUser =  this.authService.getCurrentUserFromLocalStorage();
    if (this.currentUser) {
      this.authService.getCurrentUserFromDB(this.currentUser.localId)
      .subscribe((user: User) => {
          this.userName = user.name;
          this.userEmail = user.email;
          this.userId = this.currentUser.localId;
      });
    }
  }

  onOptionsSelected(event) {
    this.optionSelected = event;
  }

  onFileSelection(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.imageFile = fileList[0];
    }
  }

  onFormSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.loader.start();
    this.submitting = false;
    const dob = form.value.dob;
    const gender = this.optionSelected;
    this.dataStorage.uploadImageToFirebaseStorage(this.userId, this.imageFile, dob, gender);
    this.loader.stop();
    this.toastr.success('Profile Updated!!', 'Notify!');
  }

}
