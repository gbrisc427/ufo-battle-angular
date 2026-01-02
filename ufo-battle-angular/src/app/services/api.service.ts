import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
providedIn: 'root'
})
export class ApiService {
private baseUrl = 'http://wd.etsisi.upm.es:10000';
private localUrl = 'http://localhost:3000';

isLoggedIn = signal<boolean>(this.hasToken());

constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.get(`${this.baseUrl}/users/login`, {
      params: { username, password },
      observe: 'response',
      responseType: 'text'
    });
  }

  register(userData: { username: string; email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/users`, userData);
  }

  checkUser(username: string) {
    return this.http.get(`${this.baseUrl}/users/${username}`);
  }

  getGlobalRecords() {
    return this.http.get<any[]>(`${this.baseUrl}/records`);
  }

  getUserRecords(username: string) {
      return this.http.get(`${this.localUrl}/records/${username}`);
    }

  private hasToken(): boolean {
      if (typeof localStorage !== 'undefined') {
        return !!localStorage.getItem('auth_token');
      }
      return false;
    }

  setToken(token: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('auth_token', token);
      this.isLoggedIn.set(true);
    }
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth_token');
      this.isLoggedIn.set(false);
    }
  }

  saveScore(scoreData: any, token: string) {
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.post(`${this.baseUrl}/records`, scoreData, { headers, observe: 'response' });
  }
}
