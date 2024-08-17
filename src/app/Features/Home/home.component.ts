import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [DialogService]
})
export class HomeComponent {

    termsVisible = false;
    privacyVisible = false;

    readonly year = new Date().getFullYear();

    constructor(
        public dialogService: DialogService,
        private router: Router
    ) {}


    navigateToDashboard() {
        this.router.navigateByUrl('/explore')
    }
}
