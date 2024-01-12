import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  base_url: string = 'http://wd.etsisi.upm.es:10000';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getRecords(): Observable<any[]> {
    const url = this.base_url + '/records';
    return this.http.get<any[]>(url);
  }

  getPersonalRecords(username: string): Observable<any[]> {
    const url = `${this.base_url}/records/${username}`;

    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Authentification token not found.');
    } else {
      const headers = new HttpHeaders({
        Authorization: `${token}`,
      });
      return this.http.get<any[]>(url, { headers });
    }
  }

  saveScore(punctuation: number, ufos: number, disposedTime: number) {
    const url = `${this.base_url}/records/`;
    const params = { punctuation, ufos, disposedTime };
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      });
      return this.http.post(url, params, { headers });
    } else {
      console.log("Score can't be saved. You are not logged in.");
      throw new Error('Error: You are not logged in.');
    }
  }

  // deleteRecords() {
  //   const token = localStorage.getItem('token');
  //   const url = `${this.base_url}/records/`;

  //   if (token) {
  //     const headers = new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: `${token}`,
  //     });

  //     return this.http.delete(url, { headers });
  //   } else {
  //     console.log("Records can't be deleted. You are not logged in.");
  //     throw new Error('Error: You are not logged in.');
  //   }
  // }
}
