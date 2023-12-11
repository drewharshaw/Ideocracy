import { Injectable, Inject, inject } from '@angular/core';

import {
    Auth,
    authState,
    User,
    user,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    UserCredential
} from '@angular/fire/auth';

import {
    doc,
    Firestore,
    docData,
    setDoc,
    DocumentReference,
    DocumentData
} from '@angular/fire/firestore';

import { FirebaseStorage, getDownloadURL, ref } from '@angular/fire/storage';

import { Observable, of, from } from 'rxjs';
import { switchMap, take, concatMap, tap } from 'rxjs/operators';

import { UserModel } from '../models/user.model';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private auth: Auth = inject(Auth);

    currentUser$: Observable<UserModel>;

    constructor(
        private firestore: Firestore,
        //TODO - report bug with library private firebaseStorage: Storage,
    ) {
        this.currentUser$ = user(this.auth).pipe(
            switchMap((user: User | null) => {
                if (user) {
                    return docData(doc(this.firestore,  `users/${user.uid}`)) as Observable<UserModel>;
                } else {
                    return of(null);
                }
            })
        );
    }

    // DPH remove
    async getUser(): Promise<UserModel | null> {
        return await this.currentUser$.pipe(take(1)).toPromise();
    }

    login(email: string, password: string): Observable<UserCredential> {
        return from(
            signInWithEmailAndPassword(this.auth, email, password)
        );
    }

    signUp({ email, firstName, lastName }: Partial<UserModel>, password: string) {
        return from(
            createUserWithEmailAndPassword(this.auth, email, password)).pipe(
                switchMap((response: UserCredential) => {
                    const userData = <UserModel>{
                        uid: response.user.uid,
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        privileges: []
                    };

                    return this.updateUserData(userData);
                })
        );
    }

    async forgotPassword(email: string) {
        return await sendPasswordResetEmail(this.auth, email);
    }

    async signOut() {
        return await signOut(this.auth);
    }

    // TODO: broken
    // getPhotoUrl(uid: string, photoUrl: string) {
    //     return from(getDownloadURL(ref(this.firebaseStorage, `user_bin/${uid}/${photoUrl}`)));
    // }


    //@TODO - create user record in firstore via a cloud function
    /** Save user data delta to firestore */
    private updateUserData({ uid, email, firstName, lastName, photoURL, privileges }: UserModel): Observable<void> {
        const userDocRef: DocumentReference<DocumentData> = doc(this.firestore, `users/${uid}`);
        const data = {
            uid,
            email,
            firstName,
            lastName,
            photoURL,
            privileges
        };

        // only save delta
        return from(setDoc(userDocRef, data, { merge: true }));
    }
}

export const firebaseAuthErrors = new Map<string, string>([
    ['auth/user-not-found',       'Username or Password is incorrect'],
    ['auth/wrong-password',       'Username or Password is incorrect'],
    ['auth/email-already-in-use', 'Email already in use']
]);
