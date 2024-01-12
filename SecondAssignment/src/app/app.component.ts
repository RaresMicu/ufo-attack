import { Component, HostListener, OnDestroy } from '@angular/core';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { UserDataService } from '../services/user-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnDestroy {
  title = 'SecondAssignment';
  token: string = '';
  private lastTokenUpdateTimestamp: number = 0;
  private tokenUpdateInterval: number = 60000;
  private updateTokenSubscription!: Subscription;

  constructor(
    private tokenService: TokenService,
    private user: UserService,
    private userDataService: UserDataService
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    this.updateTokenIfNeeded();
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeyDown(event: KeyboardEvent): void {
    this.updateTokenIfNeeded();
  }

  private updateTokenIfNeeded(): void {
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.lastTokenUpdateTimestamp;

    if (elapsedTime >= this.tokenUpdateInterval) {
      if (
        this.tokenService.getIsLogged() &&
        this.userDataService.username &&
        this.userDataService.password
      ) {
        this.updateTokenSubscription = this.user
          .loginService(
            this.userDataService.username,
            this.userDataService.password
          )
          .subscribe({
            next: (response) => {
              console.log('Token updated');
              this.lastTokenUpdateTimestamp = currentTime;
              this.token = response.headers.get('Authorization');
              this.tokenService.saveData(
                this.token,
                this.userDataService.username
              );
            },
            error: () => {
              console.log("Server error, token couldn't be updated.");
              console.error('LoginError');
            },
          });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.updateTokenSubscription) {
      this.updateTokenSubscription.unsubscribe();
    }
  }
}
