import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Validators, FormGroup, FormControl } from '@angular/forms';
import { UserModel } from 'Core/SessionManagement/models/user.model';

import { MessageService } from 'primeng/api';
import { AuthService, firebaseAuthErrors } from 'Core/SessionManagement/services/auth.service';


interface SignUpForm {
    firstName: FormControl<string|null>;
    lastName: FormControl<string|null>;
    email: FormControl<string|null>;
    password: FormControl<string|null>;
}

@Component({
    selector: 'app-signup',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignUpComonent implements OnInit {

    form: FormGroup;
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
     *
     * (?=.*?[0-9]) | At least one digit
     *
     * (?=.*?[#?!@$%^&*-]) At least one special character
     *
     * .{8,} Minimum eight in length (with the anchors)
    */
    readonly passwordStreagthRegex = new RegExp(/^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^*-]).{8,}$/);

    constructor(
        private auth: AuthService,
        private messageService: MessageService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.form = new FormGroup<SignUpForm>({
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

        this.form.get('password').valueChanges.subscribe(password => {
            this.lowerCase = this.lowerCaseRegex.test(password);
            this.oneDigit = this.oneDigitRegex.test(password);
            this.oneSpecial = this.oneSpecialRegex.test(password);
            this.minEight = this.minEightRegex.test(password);
        });
    }

    get email(): FormControl {
        return this.form.get('email') as FormControl;
    }

    get firstName(): FormControl {
        return this.form.get('firstName') as FormControl;
    }

    get lastName(): FormControl {
        return this.form.get('lastName') as FormControl;
    }

    get password(): FormControl {
        return this.form.get('password') as FormControl;
    }

    signUp() {
        if (!this.form.valid) {
            return;
        }

        const user: Partial<UserModel> = {
            email: this.form.get('email')?.value,
            firstName: this.form.get('firstName')?.value,
            lastName: this.form.get('lastName')?.value,
        };


        this.auth.signUp(user, this.password?.value).subscribe({
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
