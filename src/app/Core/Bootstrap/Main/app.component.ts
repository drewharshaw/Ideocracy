import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';

// import { ThemingService } from '@Common/services/theme.service';

import { filter, map, Subscription } from 'rxjs';
import { AuthService } from '@Core/SessionManagement/services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

    @HostBinding('class') public cssClass: string;

    isLoggedIn: boolean = false;

    private subscriptions: Subscription[] = [];

    constructor(
        private authService: AuthService,
        // private themingService: ThemingService,
        private router: Router,
        private titleService: Title
    ) {}

    ngOnInit() {
        this.subscriptions.push(
            // this.themingService.currentTheme.subscribe(
            //     (theme: string) => {
            //         this.cssClass = theme;
            //     }
            // ),
            //@TODO - When on angular 14, just use built in title
            this.router.events.pipe(
                filter((event) => event instanceof NavigationEnd),
                map(() => {
                    let route: ActivatedRoute = this.router.routerState.root;
                    let routeTitle = '';
                    while (route?.firstChild) {
                        route = route.firstChild;
                    }
                    if (route.snapshot.data['title']) {
                        routeTitle = route?.snapshot.data['title'];
                    }
                    return routeTitle;
                })
            ).subscribe((title: string) => {
                if (title) {
                    this.titleService.setTitle(`Ideocracy - ${title}`);
                }
            }),
            this.authService.currentUser$.subscribe(
                user => this.isLoggedIn = !!user
            )
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
}
