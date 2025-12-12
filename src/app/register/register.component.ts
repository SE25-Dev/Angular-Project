import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  username = '';
  password = '';
  repeatPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  register() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.password !== this.repeatPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      password: this.password,
      email: this.email,
    };

    this.authService.register(data).subscribe({
      next: (res) => {
        this.successMessage = 'Registration successful!';
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = 'Registration failed.';
        console.error(err);
      },
    });
  }
}
