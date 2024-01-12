import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  base_url: string = 'http://wd.etsisi.upm.es:10000';
  constructor(private http: HttpClient) {}

  loginService(username: string, password: string): Observable<any> {
    const url = `${this.base_url}/users/login?username=${username}&password=${password}`;
    return this.http.get(url, { observe: 'response' });
  }

  registerService(username: string, password: string, email: string) {
    const url = `${this.base_url}/users`;
    const params = { username, password, email };
    return this.http.post(url, params, { observe: 'response' });
  }

  checkRegUsername(username: string) {
    const url = `${this.base_url}/users/${username}`;
    return this.http.get(url, { observe: 'response' });
  }

  changePassword(username: string, password: string) {
    const url = `${this.base_url}/users/${username}`;
    const params = { password };

    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      });
      return this.http.patch(url, params, { headers });
    } else {
      console.log("Password couldn't be changed. You are not logged in.");
      throw new Error('Error: You are not logged in.');
    }
  }
}
