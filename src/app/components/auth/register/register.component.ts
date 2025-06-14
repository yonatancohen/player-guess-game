import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthClientService } from '../../../services/auth.client.service';
import { OtpService } from '../../../services/otp.service';
import { CommonModule } from '@angular/common';
import { AutoHyphenPhoneDirective } from '../../../directives/ auto-hyphen.directive';
import { interval, lastValueFrom, Subscription } from 'rxjs';
import { UserCredential } from 'firebase/auth';
import { Router, RouterLink } from '@angular/router';
import { GoogleAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AutoHyphenPhoneDirective, RouterLink]
})
export class RegisterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  otpForm: FormGroup;
  showOtpPopup = false;
  otpError = '';
  resendTimeout = 0;
  private countdownSubscription?: Subscription;
  verificationId: string | null = null;
  isVerifying = false;
  registrationData: { email: string; password: string; firstName: string; lastName: string, phone: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private otpService: OtpService,
    private authService: AuthClientService,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    if (this.authService.currentUser()) {
      this.router.navigate(['/game']);
    }

    this.form = this.fb.group({
      firstName: ['יוני', Validators.required],
      lastName: ['כהן', Validators.required],
      email: ['yoni@cohen.com', [Validators.required, Validators.email]],
      phone: ['054-5808014', Validators.required],
      password: ['123123', [Validators.required, Validators.minLength(6)]],
      agree: [true, Validators.requiredTrue],
    });

    // this.form = this.fb.group({
    //   firstName: ['', Validators.required],
    //   lastName: ['', Validators.required],
    //   email: ['', [Validators.required, Validators.email]],
    //   phone: ['', Validators.required],
    //   password: ['', [Validators.required, Validators.minLength(6)]],
    //   agree: [false, Validators.requiredTrue],
    // });

    this.otpForm = this.fb.group({
      otp: ['', Validators.required],
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler() {
    this.closeOtpPopup();
  }

  ngOnInit() {
    this.initRecaptcha();
  }

  ngOnDestroy() {
    this.otpService.cleanup();
    this.countdownSubscription?.unsubscribe();
  }

  private async initRecaptcha() {
    try {
      await this.otpService.initRecaptcha('recaptcha-container');
    } catch (error) {
      console.error('Failed to initialize reCAPTCHA:', error);
    }
  }

  private getFullNumber(phone: string) {
    return '+972' + phone.replace('-', '').slice(1);
  }

  private startCountdown() {
    this.resendTimeout = 60;
    this.countdownSubscription?.unsubscribe();
    this.countdownSubscription = interval(1000).subscribe(() => {
      if (this.resendTimeout > 0) {
        this.resendTimeout--;
      } else {
        this.countdownSubscription?.unsubscribe();
      }
    });
  }

  private async submitToServer() {
    const user = this.authService.currentUser();
    if (!this.registrationData || !user) return;

    try {
      if (!user) throw new Error('No user found');

      const profile = {
        uid: user.uid,
        firstName: this.registrationData.firstName,
        lastName: this.registrationData.lastName,
        email: this.registrationData.email,
        phone: this.registrationData.phone
      };

      const response = await lastValueFrom(this.userService.createProfile(profile));

      this.toastr.success('הפרופיל נוצר בהצלחה');
    } catch (error) {
      console.error('Error creating profile:', error);
      this.toastr.error('שגיאה ביצירת הפרופיל');
      throw error;
    }
  }

  private async completeRegistrationOTP() {
    if (!this.registrationData) return;

    this.form.get('email')?.setErrors({ emailInUse: false });
    this.form.get('password')?.setErrors({ weakPassword: false });
    this.form.setErrors({ registrationFailed: false });

    try {
      const { email, password, firstName, lastName } = this.registrationData;

      await this.authService.updateName(firstName, lastName);
      await this.authService.linkEmailPassword(email, password);
      await this.submitToServer();

      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        this.form.get('email')?.setErrors({ emailInUse: true });
      } else if (error.code === 'auth/weak-password') {
        this.form.get('password')?.setErrors({ weakPassword: true });
      } else {
        this.form.setErrors({ registrationFailed: true });
      }
    }
  }

  async sendOTP() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      const phoneNumber = this.getFullNumber(this.form.value.phone);
      this.verificationId = await this.otpService.sendOTP(phoneNumber);
      this.showOtpPopup = true;
      this.startCountdown();
    } catch (error: any) {
      this.otpError = error.message || 'שגיאה בשליחת קוד האימות';
    }
  }

  closeOtpPopup() {
    this.showOtpPopup = false;
    this.otpForm.reset();
    this.otpError = '';
    this.verificationId = null;
    this.registrationData = null;
    this.countdownSubscription?.unsubscribe();
    this.resendTimeout = 0;
  }

  async verifyOtp() {
    if (this.otpForm.invalid || !this.verificationId) return;

    this.isVerifying = true;
    try {
      await this.otpService.verifyOTP(this.verificationId, this.otpForm.value.otp);

      if (this.registrationData) {
        await this.completeRegistrationOTP();
      }

      this.closeOtpPopup();
    } catch (error: any) {
      this.otpError = error.message || 'שגיאה באימות הקוד';
    } finally {
      this.isVerifying = false;
    }
  }

  async registerWithEmail() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.registrationData = {
      email: this.form.value.email,
      password: this.form.value.password,
      phone: this.form.value.phone,
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName
    };

    await this.sendOTP();
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const creds = await this.authService.loginWithProvider(provider);

      // Get user info from Google
      const user = creds.user;
      const displayName = user.displayName || '';
      const [firstName = '', lastName = ''] = displayName.split(' ');

      // Store registration data for server submission
      this.registrationData = {
        email: user.email || '',
        password: '',
        firstName: firstName,
        lastName: lastName,
        phone: user.phoneNumber || ''
      };

      if (firstName || lastName) {
        await this.authService.updateName(firstName, lastName);
      }

      await this.submitToServer();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Google login error:', error);
    }
  }
}
