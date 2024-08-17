import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';


import { AuthService, firebaseAuthErrors } from '@Core/SessionManagement/services/auth.service';
import { UserModel } from '@Core/SessionManagement/models/user.model';


export enum AuthMode {
    Login = 'Login',
    SignUp = 'SignUp'
}

interface SignUpForm {
    firstName: FormControl<string|null>;
    lastName: FormControl<string|null>;
    email: FormControl<string|null>;
    password: FormControl<string|null>;
}

interface LoginForm {
    username: FormControl<string|null>;
    password: FormControl<string|null>;
    rememberMe: FormControl<boolean>;
}

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.scss'
})
export class AuthDialogComponent implements OnInit {

    @Input() mode: AuthMode = AuthMode.Login;

    loginForm: FormGroup;
    signUpForm: FormGroup;

    loading: boolean = false;
    passwordVisible = false;

    lowerCase: boolean = false;
    oneDigit: boolean = false;
    oneSpecial: boolean = false;
    minEight: boolean = false;

    lowerCaseRegex = new RegExp(/(?=.*?[a-z])/);
    oneDigitRegex = new RegExp(/(?=.*?[0-9])/);
    oneSpecialRegex = new RegExp(/(?=.*?[#?!@$%^&*-])/);
    minEightRegex = new RegExp(/.{8,}/);

    /*
     * (?=.*?[a-z]) | At least one lower case English letter
     * (?=.*?[0-9]) | At least one digit
     * (?=.*?[#?!@$%^&*-]) At least one special character
     * .{8,} Minimum eight in length (with the anchors)
    */
    readonly passwordStreagthRegex = new RegExp(/^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^*-]).{8,}$/);
    readonly id = 'authDialog';
    readonly authMode = AuthMode;

    constructor(
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService,
    ) {}

    ngOnInit() {
        this.loginForm = new FormGroup<LoginForm>({
            username: new FormControl('', {
                validators: [Validators.required, Validators.email],
                updateOn: 'blur'
            }),
            password: new FormControl('',Validators.required),
            rememberMe: new FormControl(false)
        });

        this.signUpForm = new FormGroup<SignUpForm>({
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            email: new FormControl('', {
                validators: [Validators.required, Validators.email],
                updateOn: 'blur'
            }),
            password: new FormControl('', {
                validators: [Validators.required, Validators.pattern(this.passwordStreagthRegex)],
            })
        });

        this.signUpForm.get('password').valueChanges.subscribe(password => {
            this.lowerCase = this.lowerCaseRegex.test(password);
            this.oneDigit = this.oneDigitRegex.test(password);
            this.oneSpecial = this.oneSpecialRegex.test(password);
            this.minEight = this.minEightRegex.test(password);
        });
    }

    get username(): FormControl {
        return this.loginForm.get('username') as FormControl;
    }

    get loginPassword(): FormControl {
        return this.loginForm.get('password') as FormControl;
    }

    get email(): FormControl {
        return this.signUpForm.get('email') as FormControl;
    }

    get firstName(): FormControl {
        return this.signUpForm.get('firstName') as FormControl;
    }

    get lastName(): FormControl {
        return this.signUpForm.get('lastName') as FormControl;
    }

    get signUpPassword(): FormControl {
        return this.signUpForm.get('password') as FormControl;
    }

    login() {
        if (!this.loginForm.valid) {
            return;
        }

        this.loading = true;

        this.authService.login(this.username.value, this.loginPassword.value).subscribe({
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


    signUp() {
        if (!this.signUpForm.valid) {
            return;
        }

        const user: Partial<UserModel> = {
            email: this.signUpForm.get('email')?.value,
            firstName: this.signUpForm.get('firstName')?.value,
            lastName: this.signUpForm.get('lastName')?.value,
        };


        this.authService.signUp(user, this.signUpPassword?.value).subscribe({
            next: () => {
                this.messageService.add({
                    severity:'success',
                    summary:'Account Created',
                    detail:'Please verify your email'
                });
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.messageService.add({
                    severity:'error',
                    summary:'',
                    detail:`${firebaseAuthErrors.get(err.code) || err}`
                });
            }
        });
    }

    toggleShowPassword() {
        this.passwordVisible = !this.passwordVisible;
    }
}
