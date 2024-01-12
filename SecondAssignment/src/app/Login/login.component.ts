import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { HttpClientModule } from '@angular/common/http';
import { UserDataService } from '../../services/user-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: `./login.component.html`,
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  token: string = '';
  errorMessage: string = '';
  errorStyle1: string = '';
  errorStyle2: string = '';

  constructor(
    private user: UserService,
    private tokenService: TokenService,
    private cdRef: ChangeDetectorRef,
    private userDataService: UserDataService,
    private router: Router
  ) {}

  validateInputs(): void {
    this.errorMessage = '';
    this.errorStyle1 = '';
    this.errorStyle2 = '';

    if (this.password.length === 0) {
      this.errorMessage = 'Password is required';
      this.errorStyle2 = 'error-input';
      return;
    }

    if (this.username.length === 0) {
      this.errorMessage = 'Username is required';
      this.errorStyle1 = 'error-input';
      return;
    }

    this.Login();
  }

  Login(): void {
    this.user.loginService(this.username, this.password).subscribe({
      next: (response) => {
        this.userDataService.username = this.username;
        this.userDataService.password = this.password;

        this.token = response.headers.get('Authorization');
        this.tokenService.saveData(this.token, this.username);
        this.router.navigate(['/play']);
        this.cdRef.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Username or password is wrong.';
        console.error('LoginError');
        this.cdRef.detectChanges();
      },
    });
  }
}
