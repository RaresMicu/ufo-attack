import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  repeatPassword: string = '';
  errorMessage: string = '';
  errorStyle1: string = '';
  errorStyle2: string = '';
  errorStyle3: string = '';
  errorStyle4: string = '';

  constructor(
    private user: UserService,
    private cdRef: ChangeDetectorRef,
    private token: TokenService
  ) {}

  validateInputs(): void {
    this.errorMessage = '';
    this.errorStyle1 = '';
    this.errorStyle2 = '';
    this.errorStyle3 = '';
    this.errorStyle4 = '';

    if (this.token.getIsLogged()) {
      this.errorMessage = 'You are already logged in';
      return;
    }

    if (this.username.length === 0) {
      this.errorMessage = 'Username is required';
      this.errorStyle1 = 'error-input';
      return;
    }

    if (this.email.length === 0) {
      this.errorMessage = 'Email is required';
      this.errorStyle2 = 'error-input';
      return;
    }

    if (this.password.length === 0) {
      this.errorMessage = 'Password is required';
      this.errorStyle3 = 'error-input';
      return;
    }

    if (this.repeatPassword.length === 0) {
      this.errorMessage = 'Confirm password is required';
      this.errorStyle4 = 'error-input';
      return;
    }

    if (this.password != this.repeatPassword) {
      this.errorMessage = "Passwords don't match";
      this.errorStyle3 = 'error-input';
      this.errorStyle4 = 'error-input';
      return;
    }

    this.user.checkRegUsername(this.username).subscribe({
      next: (response) => {
        if (response.status == 200) {
          this.errorMessage = 'Something went wrong.(User already exists.)'; //in order not to let hackers know what's in the database but without the added paranthesis
          this.cdRef.detectChanges();
        }
      },
      error: () => {
        this.Register();
      },
    });
  }

  Register(): void {
    this.user
      .registerService(this.username, this.password, this.email)
      .subscribe({
        next: (response) => {
          this.errorMessage = 'You registered succesfully!:)';
          console.log('Register succesfully:', response);
          this.cdRef.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Something went wrong.(Register)';
          console.error('RegisterError');
          this.cdRef.detectChanges();
        },
      });
  }
}
