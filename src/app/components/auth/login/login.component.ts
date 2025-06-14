import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthClientService } from '../../../services/auth.client.service';
import { CommonModule } from '@angular/common';
import { GoogleAuthProvider } from 'firebase/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class LoginComponent {
  form: FormGroup;
  registrationData: { email: string; password: string; firstName: string; lastName: string, phone: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthClientService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    if (this.authService.currentUser()) {
      this.router.navigate(['/game']);
    }
  }

  login() {
    this.form.get('email')?.setErrors({ wrongPassword: false });
    this.form.get('email')?.setErrors({ notFound: false });

    this.authService.login(this.form.value.email!, this.form.value.password!).then((userCredential) => {
      this.router.navigate(['/game']);
    }).catch((error) => {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        this.form.get('password')?.setErrors({ wrongPassword: true });
      } else if (error.code === 'auth/user-not-found') {
        this.form.get('email')?.setErrors({ notFound: true });
      } else {
        this.form.get('email')?.setErrors({ notFound: true });
      }
    });;
  }

  async loginWithGoogle() {
    try {
      // todo: need to verify he signed up before!

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

      // await this.submitToServer();
      this.router.navigate(['/game']);
    } catch (error) {
      console.error('Google login error:', error);
    }
  }
}