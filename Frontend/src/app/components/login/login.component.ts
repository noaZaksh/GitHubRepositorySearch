import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);

  readonly loginSuccess = output<void>();

  username = '';
  password = '';

  error = '';
  loading = false;

  login(): void {
    this.error = '';

    if (!this.username.trim() || !this.password) {
      this.error = 'Please enter username and password.';
      return;
    }

    this.loading = true;

    this.authService
      .login(this.username.trim(), this.password)
      .subscribe({
        next: () => {
          this.loading = false;
          this.loginSuccess.emit();
        },

        error: () => {
          this.loading = false;
          this.error = 'Invalid username or password.';
        },
      });
  }
}