export interface UserModel {
    uid: string;
    email: string;
    photoURL?: string;
    firstName?: string;
    lastName?: string;
    privileges?: string[]
}
