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

  constructor(private route: ActivatedRoute,private authService: AuthService,
              private modalService: ModalService) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['uid'];
    if (this.userId) {
      this.authService.getCurrentUserFromDB(this.userId)
          .subscribe((response: User) => {
            this.userName = response.name;
            this.email = response.email;
            this.imgUrl = response.avatarUrl;
        });
    }

     $(document).ready(function ($) {
      $(".sidebar-dropdown > a").click(function () {
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



  getProfilePicUrl(id: string) {
    // this.authService.getCurrentUserFromDB(id)
    //   .subscribe((user: User) => {
    //     if (user.avatarUrl !== null && user.avatarUrl !== '') {
    //       this.imgUrl = user.avatarUrl;
    //     } else {
    //       this.imgUrl = '../assets/avatar.svg';
    //     }
    //   });
  }

  featureUnderProgress() {
    alert('Feature under development!');
  }

}