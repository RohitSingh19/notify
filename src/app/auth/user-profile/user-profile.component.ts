import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataStorageService } from 'src/app/shared/data-storage-service';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AuthService } from '../auth-service';
import { User } from '../user.model';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from 'src/app/shared/modal-popup/modal-service';




@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  currentUser: User;

  constructor(private dataStorage: DataStorageService,
              private loader: LoadingBarService, private router: Router,
              private authService: AuthService, private toastr: ToastrService, private modal: ModalService) { }

  options = ['Select Gender', 'Male', 'Female'];
  optionSelected = 'Select Gender';
  imageFile: File;
  fileName: string;
  avatarUrl: string;
  userId: string;
  userName: string;
  userEmail: string;
  userGender: string;
  userDOB: string;
  submitting: boolean;
  isLoading: boolean;

  ngOnInit(): void {
    this.fetchUser();
    this.avatarUrl = '../../../assets/003-user.png';
  }

  fetchUser() {
    this.isLoading = true;
    this.currentUser =  this.authService.getCurrentUserFromLocalStorage();
    if (this.currentUser) {
      this.authService.getCurrentUserFromDB(this.currentUser.localId)
      .subscribe((user: User) => {
          this.userName = user.name;
          this.userEmail = user.email;
          this.userId = this.currentUser.localId;
          this.userGender = user.gender;
          this.optionSelected = user.gender;
          this.userDOB = user.dob;
          if (user.avatarUrl.length > 0) {
            this.avatarUrl = user.avatarUrl;
          }
          this.isLoading = false;
      });
    }
  }

  onOptionsSelected(event) {
    this.optionSelected = event;
  }

  onFileSelection(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let reader = new FileReader();
      reader.onload = (event :any) => {
        this.avatarUrl = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.imageFile = fileList[0];
      this.fileName = fileList[0].name;
    }
  }

  onFormSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;
    this.loader.start();
    this.submitting = false;
    const dob = form.value.dob;
    const gender = this.optionSelected;
    this.dataStorage.uploadImageToFirebaseStorage(this.userId, this.imageFile, dob, gender);
    this.loader.stop();
    this.toastr.success('Profile Updated!!', 'Notify!');
    this.isLoading = false;
    console.log(dob);
  }
}
