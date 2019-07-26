import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = "/api/user";
  constructor(private http: HttpClient) { }

  addUser(user) {
    return this.http.post("/api/auth/register", user);
  }

  getAllUsers() {
    return this.http.get(this.url)
  }

  getUserByManager(id) {
    return this.http.get(this.url + '/flmId/' + id)
  }

  getUserByRole(role) {
    return this.http.get(this.url + '/role/' + role)
  }

  deleteUser(id) {
    return this.http.delete(this.url + '/' + id)
  }

  updateUser(id, user) {
    return this.http.put(this.url + '/' + id, user)
  }

  getUser(id) {
    return this.http.get(this.url + '/' + id)
  }

  importUser(csv) {
    return this.http.post(this.url + '/import', csv)
  }
}
