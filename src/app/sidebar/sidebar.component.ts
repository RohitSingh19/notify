import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth-service';
import { User } from '../auth/user.model';
import * as $ from 'jquery';
import { ModalService } from '../shared/modal-popup/modal-service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  userId: string;
  imgUrl = 'https://raw.githubusercontent.com/azouaoui-med/pro-sidebar-template/gh-pages/src/img/user.jpg';

  userName: string;
  email: string;
  isLoading = true;

  constructor(private route: ActivatedRoute, private authService: AuthService,
              private modalService: ModalService, private router: Router) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.route.snapshot.params['uid'];
    if (this.userId) {
      this.authService.getCurrentUserFromDB(this.userId)
          .subscribe((response: User) => {
            this.userName = response.name;
            this.email = response.email;
            if (response.avatarUrl.length > 0) {
                  this.imgUrl = response.avatarUrl;
            }
            this.isLoading = false;
        });
    }
    // tslint:disable-next-line: only-arrow-functions
    $(document).ready(function ($) {
      $('.sidebar-dropdown > a').click(function () {
        $(".sidebar-submenu").slideUp(200);
        if (
          $(this)
            .parent()
            .hasClass("active")
        ) {
          $(".sidebar-dropdown").removeClass("active");
          $(this)
            .parent()
            .removeClass("active");
        } else {
          $(".sidebar-dropdown").removeClass("active");
          $(this)
            .next(".sidebar-submenu")
            .slideDown(200);
          $(this)
            .parent()
            .addClass("active");
        }
      });
      $("#close-sidebar").click(function () {
        $(".page-wrapper").removeClass("toggled");
      });
      $("#show-sidebar").click(function () {
        $(".page-wrapper").addClass("toggled");
      });
    });

  }

  OnUserProfileClick() {
    //this.router.navigate(['/user-profile', this.userId]);
    this.modalService.openModal();
  }

  OnCalendarClick() {
    this.router.navigate(['/calendar', this.userId]);
  }


  getProfilePicUrl(id: string) {
  }

  featureUnderProgress() {
    alert('Feature under development!');
  }

  OnLogoutClick() {
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

}
