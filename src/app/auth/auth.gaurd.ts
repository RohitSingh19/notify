import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth-service';


@Injectable({
    providedIn: 'root'
})
export class AuthGaurd implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean {
        if (!this.authService.autoLogin()) {
            this.router.navigate(['auth/login']);
            return false;
        } else {
            return true;
        }
     }
}