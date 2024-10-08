import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import {
    provideFirestore,
    getFirestore,
    connectFirestoreEmulator,
    enableIndexedDbPersistence,
} from '@angular/fire/firestore';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { provideStorage, getStorage, connectStorageEmulator } from '@angular/fire/storage';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { MenuModule } from 'primeng/menu';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { FloatLabelModule } from 'primeng/floatlabel';


import { AppRoutingModule } from '@Core/Routing/app-routing.module';
import { AppComponent } from '@Core/Bootstrap/Main/app.component';
import { NavbarComponent } from '@Common/Layout/Navbar/navbar.component';
import { AuthService } from '@Core/SessionManagement/services/auth.service';
import { HomeComponent } from '@Features/Home/home.component';

import { environment } from '@Environments/environment';
import { AuthDialogComponent } from '@Common/Dialog/AuthDialog/auth-dialog.component';
import { ExploreComponent } from './Features/Explore/explore.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AuthDialogComponent,
    ExploreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    MenuModule,
    MessagesModule,
    MessageModule,
    DialogModule,
    SidebarModule,
    CardModule,
    AvatarModule,
    DynamicDialogModule,
    ToastModule,
    TabViewModule,
    FloatLabelModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [
    AuthService,
    MessageService
],
  bootstrap: [AppComponent]
})
export class AppModule { }
