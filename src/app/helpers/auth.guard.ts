import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { navItems } from '../containers/default-layout/_nav';

import { AuthenticationService } from '../services';
import { INavData } from '@coreui/angular';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(user => { this.changeName(user) });
    }

    currentUser: any;
    public navItems: INavData[] = [];
    
    private changeName(user: any): void {
        this.currentUser = user;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;

        if (currentUser) {
            // authorised so return true
            for (let index = 0; index < navItems.length; index++) {
                if (this.currentUser.role_id == 1 || this.currentUser.role_id == 2) {
                    return true;
                } else if(this.currentUser.role_id == 3 && navItems[index].url?.indexOf(route.routeConfig?.path!) !== -1 ) {
                    if (this.currentUser.access.includes(navItems[index].name) || route.routeConfig?.path == 'dashboard') {
                        return true;
                    } else {
                        this.router.navigate(['/500']);
                        return false;
                    }
                }
            }
            return false
        } else {
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
    }
}
