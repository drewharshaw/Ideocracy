import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '@Core/SessionManagement/services/auth.service';

/** If user authenticated, reroute to dashboard, otherwise nav continues */
@Injectable({
    providedIn: 'root'
})
export class RedirectGuard {

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UrlTree | boolean> {
        return this.authService.currentUser$.pipe(
            map(loggedIn => loggedIn ? this.router.parseUrl('/dashboard') : true)
        );
    }
}
