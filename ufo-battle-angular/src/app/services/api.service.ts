import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
providedIn: 'root'
})
export class ApiService {
private baseUrl = 'http://wd.etsisi.upm.es:10000';

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

  setToken(token: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('auth_token', token);
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
    }
  }
}
