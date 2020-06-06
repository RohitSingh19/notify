import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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

    this.isLoading = true;

    this.authService.login(email, password)
      .subscribe(resData => {
        this.router.navigate(['/home', resData['localId']]);
        this.isLoading = false;
      }, errorMsg => {
        this.isLoading = false;
      });
    form.reset();
  }
}

