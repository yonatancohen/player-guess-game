import { Injectable, inject } from '@angular/core';
import {
    RecaptchaVerifier,
    Auth,
    ConfirmationResult,
    UserCredential,
    PhoneAuthProvider,
    signInWithCredential,
} from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { authState } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class OtpService {
    private auth = inject(Auth);
    private recaptchaVerifier: RecaptchaVerifier | null = null;

    async initRecaptcha(containerId: string = 'recaptcha-container') {
        try {
            // Wait for auth to be initialized
            await firstValueFrom(authState(this.auth));

            // Clear any existing reCAPTCHA
            if (this.recaptchaVerifier) {
                this.recaptchaVerifier.clear();
            }

            // Create new reCAPTCHA verifier
            this.recaptchaVerifier = new RecaptchaVerifier(
                this.auth,
                containerId,
                { size: 'invisible' },
            );

            // Render the reCAPTCHA
            await this.recaptchaVerifier.render();
        } catch (error) {
            console.error('Failed to initialize reCAPTCHA:', error);
            throw error;
        }
    }

    async sendOTP(phone: string) {
        if (!this.recaptchaVerifier) {
            throw new Error('reCAPTCHA not initialized');
        }

        const provider = new PhoneAuthProvider(this.auth);
        return await provider.verifyPhoneNumber(phone, this.recaptchaVerifier);
    }

    async verifyOTP(verificationId: string, code: string): Promise<UserCredential> {
        const phoneAuthCredential = PhoneAuthProvider.credential(verificationId, code);
        return await signInWithCredential(this.auth, phoneAuthCredential);
    }

    cleanup() {
        if (this.recaptchaVerifier) {
            this.recaptchaVerifier.clear();
            this.recaptchaVerifier = null;
        }
    }
}