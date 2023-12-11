import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { AuthService, firebaseAuthErrors } from 'Core/SessionManagement/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    form: FormGroup;
    loading: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.form = new FormGroup ({
            username: new FormControl('', {
                validators: [Validators.required, Validators.email],
                updateOn: 'blur'
            }),
            password: new FormControl('',Validators.required),
            rememberMe: new FormControl(false)
        });
    }


    get username(): FormControl {
        return this.form.get('username') as FormControl;
    }

    get password(): FormControl {
        return this.form.get('password') as FormControl;
    }

    login() {
        if (!this.form.valid) {
            return;
        }

        this.loading = true;

        this.authService.login(this.username.value, this.password.value).subscribe({
            next: () => {
                this.router.navigateByUrl('/dashboard');
                this.loading = false;
            },
            error: (response) => {
                this.messageService.add({
                    severity:'error',
                    summary:'Login Failed',
                    detail:`${firebaseAuthErrors.get(response.code) || response}`
                });
                this.loading = false;
            }
        });
    }

    // TODO trigger b/e cloud funciton
    // onCaptchaResponse(response: any) {
    //
    // }
}
