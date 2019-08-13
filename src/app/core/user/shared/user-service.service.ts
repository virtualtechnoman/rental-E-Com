import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorage } from '../../../auth/token.storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'token': this.tokenService.getToken()
  });
  url = '/api/user';
  constructor(private http: HttpClient, private tokenService: TokenStorage) {
  }

  addUser(user) {
    return this.http.post('/api/user/', user, { headers: this.headers });
  }

  getAllUsers() {
    return this.http.get(this.url, { headers: this.headers });
  }

  getUserByManager(id) {
    return this.http.get(this.url + '/flmId/' + id, { headers: this.headers });
  }

  getUserByRole(id) {
    return this.http.post(this.url + '/role' + id, { headers: this.headers });
  }

  deleteUser(id) {
    return this.http.delete(this.url + '/' + id, { headers: this.headers });
  }

  updateUser(id, user) {
    return this.http.put(this.url + '/' + id, user, { headers: this.headers });
  }

  getUser(id) {
    return this.http.get(this.url + '/' + id, { headers: this.headers });
  }

  importUser(csv) {
    return this.http.post(this.url + '/import', csv);
  }
}
