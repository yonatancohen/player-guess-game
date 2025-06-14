import { Injectable, computed, inject, signal } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  signInWithPopup,
  User,
  signInWithPhoneNumber,
  ApplicationVerifier,
  AuthProvider,
  updateProfile,
  EmailAuthProvider,
  linkWithCredential,
  UserCredential,
  onAuthStateChanged,
  fetchSignInMethodsForEmail,
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthClientService {
  private auth = inject(Auth);

  currentUser = signal<User | null | undefined>(undefined);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);
    });
  }

  initClientAuth(): Promise<void> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        this.currentUser.set(user);
        resolve();
      });
    });
  }

  get isLoggedIn() {
    return computed(() => !!this.currentUser())();
  }

  register(phone: string, recaptchaVerifier: ApplicationVerifier) {
    return signInWithPhoneNumber(this.auth, phone, recaptchaVerifier);
  }

  async updateName(firstName: string, lastName: string) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No user logged in');

    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });
  }

  async linkEmailPassword(email: string, password: string): Promise<UserCredential> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No user logged in');

    const credential = EmailAuthProvider.credential(email, password);
    return await linkWithCredential(user, credential);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // todo:
  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  logout() {
    return signOut(this.auth);
  }

  loginWithProvider(provider: AuthProvider) {
    return signInWithPopup(this.auth, provider);
  }
}
