import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from './user.model';
import { TokenStorage } from '../../../auth/token.storage';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'token': this.tokenService.getToken()
  });
  url = '/api/role';
  constructor(private http: HttpClient, private tokenService: TokenStorage) { }

  addUserRole(userRole) {
    return this.http.post(this.url + '/', userRole, { headers: this.headers });
  }

  getAllUserRoles() {
    return this.http.get(this.url, { headers: this.headers });
  }

  deleteUserRole(id) {
    return this.http.delete(this.url + '/' + id, { headers: this.headers });
  }

  updateUserRole(id, user) {
    return this.http.put(this.url + '/' + id, user, { headers: this.headers });
  }

  importCustomer(csv) {
    return this.http.post(this.url + '/import', csv, { headers: this.headers });
  }
}
