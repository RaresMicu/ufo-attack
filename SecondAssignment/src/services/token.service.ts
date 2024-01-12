import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  isLogged: boolean = false;

  constructor() {}

  saveData(token: string, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    this.isLogged = true;
  }

  clearData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.isLogged = false;
  }

  isToken(): boolean {
    if (localStorage.getItem('token')) {
      return true;
    }
    return false;
  }

  getIsLogged(): boolean {
    return this.isLogged || this.isToken();
  }
}
