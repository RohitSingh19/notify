import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: ActivatedRoute, private route: Router) { }
  userId: string;
  ngOnInit() {
      this.userId = this.router.snapshot.params['uid'];
  }

  onLogoutClicked() {
    localStorage.removeItem('user');
    this.route.navigate(['/auth/login']);
  }
}
