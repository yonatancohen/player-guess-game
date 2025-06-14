import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthClientService } from '../../../services/auth.client.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ForgotPasswordComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthClientService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  reset() {
    this.auth.resetPassword(this.form.value.email!);
  }
}