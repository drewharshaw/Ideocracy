import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { FirebaseStorage, ref, getDownloadURL } from '@angular/fire/storage';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuItem } from 'primeng/api';

import { Subscription, from } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';


import { AuthService } from '@Core/SessionManagement/services/auth.service';
import { AuthDialogComponent } from '@Common/Dialog/AuthDialog/auth-dialog.component';



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

    ref: DynamicDialogRef | undefined;

    leftItems: MenuItem[] = [
        {
            label: 'Explore',
            routerLink: '/explore',
            visible: true
        },
        {
            label: 'Create',
            routerLink: '/create',
            visible: false
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

    openAuthDialog() {
        this.ref = this.dialogService.open(AuthDialogComponent, {
            header: 'Login',
            dismissableMask: true,
            width: '550px',
            height: '450px'
        });
    }

    openSettingsDialog() {

    }

    logout() {
        this.authService.signOut().then(
            _ => this.router.navigateByUrl('/')
        );
    }


    ngOnDestroy() {
        this.subscriptions.forEach(x => x.unsubscribe());
    }
}
