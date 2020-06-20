import { Component, OnInit} from '@angular/core';
import { AuthService } from './auth/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'notify';
  rootNode: any;
  container: any;
  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    const uid = this.getCurrentUserUid();
    if (uid) {
      this.router.navigate(['/home', uid]);
    } else {
      this.router.navigate(['auth/login']);
    }
  }
  getCurrentUserUid(): string {
    const user = this.authService.getCurrentUserFromLocalStorage();
    if (user) {
      return user.localId;
    }
  }
}

