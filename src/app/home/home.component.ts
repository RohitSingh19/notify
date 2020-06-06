import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth-service';
import { Router } from '@angular/router';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    const uid = this.getCurrentUserUid();
    if (!uid) {
      this.router.navigate(['auth/login']);
    }
  }

  getCurrentUserUid(): string {
    const user: User = this.authService.getCurrentUserFromLocalStorage();
    if (user) {
      return user.localId;
    }
  }
}
