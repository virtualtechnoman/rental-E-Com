import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  url = "/api/userrole";
  constructor(private http: HttpClient) { }

  addUserRole(userRole) {
    return this.http.post(this.url + '/', userRole)
  }

  getAllUserRoles() {
    return this.http.get(this.url)
  }

  deleteUserRole(id) {
    return this.http.delete(this.url + '/' + id)
  }

  updateUserRole(id, user) {
    return this.http.put(this.url + '/' + id, user)
  }

  importCustomer(csv) {
    return this.http.post(this.url + '/import', csv)
  }
}
