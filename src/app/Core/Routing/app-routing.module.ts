import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '@Features/Home/home.component';
import { ExploreComponent } from '@Features/Explore/explore.component';

import { RedirectGuard } from '@Core/Routing/guards/redirect.guard';

const routes: Routes = [
    { path: '',           data: { title: 'Home'},       component: HomeComponent,    canActivate: [RedirectGuard]},
    { path: 'explore',    data: { title: 'Explore'},    component: ExploreComponent, canActivate: [RedirectGuard]},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
