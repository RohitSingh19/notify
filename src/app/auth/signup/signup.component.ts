import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isLoading = false;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onSubmitForm(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.Email;
    const password = form.value.Password;
    const name = form.value.Name;
    this.isLoading = true;
    this.authService.signUp(email, password, name)
        .subscribe(resData => {
          this.router.navigate(['/home', resData['localId']]);
        }, errorMsg => {
          this.isLoading = false;
        });
    form.reset();
  }
}
