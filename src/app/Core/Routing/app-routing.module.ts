import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from 'Core/Bootstrap/Login/login.component';
import { SignUpComonent } from 'Core/Bootstrap/SignUp/sign-up.component';
import { HomeComponent } from 'Features/Home/home.component';
import { RedirectGuard } from 'Core/Routing/guards/redirect.guard';

const routes: Routes = [
    { path: '',       data: { title: 'Home'},   component: HomeComponent,  canActivate: [RedirectGuard]},
    { path: 'login',  data: { title: 'Login'},  component: LoginComponent, canActivate: [RedirectGuard]},
    { path: 'signup', data: { title: 'SignUp'}, component: SignUpComonent, canActivate: [RedirectGuard]},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
