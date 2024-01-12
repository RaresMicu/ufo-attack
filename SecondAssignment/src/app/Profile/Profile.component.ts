import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { Subscription } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: `./Profile.component.html`,
  styleUrl: './Profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnDestroy {
  private changePasswordSubscription!: Subscription;
  newPassword: string = '';
  newPasswordConfirm: string = '';
  errorMessage: string = '';
  errorStyle1: string = '';
  errorStyle2: string = '';
  username: string = localStorage.getItem('username') || '';

  constructor(
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    public tokenService: TokenService
  ) {}

  validateInputs(): void {
    this.errorMessage = '';
    this.errorStyle1 = '';
    this.errorStyle2 = '';

    if (this.newPassword.length === 0) {
      this.errorMessage = 'Password is required';
      this.errorStyle2 = 'error-input';
      return;
    }

    if (this.newPasswordConfirm.length === 0) {
      this.errorMessage = 'Confirm Password is required';
      this.errorStyle1 = 'error-input';
      return;
    }

    if (this.newPassword != this.newPasswordConfirm) {
      this.errorMessage = "Passwords don't match";
      this.errorStyle1 = 'error-input';
      this.errorStyle2 = 'error-input';
      return;
    }

    this.changePasswordComponent();
  }

  changePasswordComponent(): void {
    if (this.username && this.tokenService.isToken()) {
      this.changePasswordSubscription = this.userService
        .changePassword(this.username, this.newPassword)
        .subscribe({
          next: (response) => {
            this.errorMessage = 'Password changed successfully!';
            console.log('Password changed!');
            this.cdr.detectChanges();
          },
          error: () => {
            this.errorMessage = 'Something went wrong with password change.';
            console.error('PasswordChangeError');
            this.cdr.detectChanges();
          },
        });
    }
  }

  ngOnDestroy(): void {
    if (this.changePasswordSubscription) {
      this.changePasswordSubscription.unsubscribe();
    }
  }
}
