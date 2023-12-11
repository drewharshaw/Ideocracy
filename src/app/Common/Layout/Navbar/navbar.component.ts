import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

// import { SettingsDialogComponent } from '../../dialogs/settings-dialog/settings-dialog.component';

import { AuthService } from '../../../Core/SessionManagement/services/auth.service';
import { DialogService } from 'primeng/dynamicdialog';

import { FirebaseStorage, ref, getDownloadURL } from '@angular/fire/storage';

import { Subscription, from } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { MenuItem } from 'primeng/api';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    providers: [DialogService]
})
export class NavbarComponent implements OnInit, OnDestroy {

    fullName: string;
    photoURL: string;
    admin: boolean;

    leftItems: MenuItem[] = [
        {
            label: 'Dashboard',
            routerLink: '/dashboard',
            visible: true
        },
        {
            label: 'Map',
            routerLink: '/map',
            visible: true
        },
        {
            label: 'Admin',
            routerLink: '/admin',
            visible: false
        }
    ];

    private subscriptions: Subscription[] = [];

    constructor(
        public authService: AuthService,
        private dialogService: DialogService,
        private router: Router
    ) { }

    ngOnInit() {
        this.subscriptions.push(
            this.authService.currentUser$
                .pipe(
                    filter(x => !!x)
                )
                .subscribe((user) => {
                    this.fullName = `${user.firstName} ${user.lastName }`;
                    const adminSection = this.leftItems.find(x => x.label == 'Admin');
                    if (adminSection) {
                        adminSection.visible = user.privileges.includes('admin');
                    }
                }),
            // this.authService.getPhotoUrl(this.authService.currentUser.uid, this.authService.currentUser.photoURL).subscribe(url => {
            //     this.authService.currentUser.photoURL = url;
            // })
        );
    }

    logout() {
        this.authService.signOut().then(
            _ => this.router.navigateByUrl('/')
        );
    }

    showSettingsDialog() {
        // const ref = this.dialogService.open(SettingsDialogComponent, {
        //     header: 'Settings',
        //     dismissableMask: true
        // });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(x => x.unsubscribe());
    }
}
