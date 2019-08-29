import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorage } from '../../../auth/token.storage';


@Injectable()

export class TruckService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'token': this.tokenService.getToken()
  });

  url = '/api/user/driver';
  url2 = '/api/vehicle';
  url3='/api/user/driver';
  constructor(private http: HttpClient, private tokenService: TokenStorage) { }

  getAllDrivers() {
    return this.http.get(this.url + '/', { headers: this.headers });
  }

  getAllAvailableDrivers() {
    return this.http.get(this.url + '/available', { headers: this.headers });
  }

  addDriver(driver) {
    return this.http.post(this.url + '/', driver, { headers: this.headers });
  }

  deleteDriver(id) {
    return this.http.delete(this.url + '/' + id, { headers: this.headers });
  }

  updateDriver(id, product) {
    return this.http.put(this.url + '/' + id, product, { headers: this.headers });
  }

  // ===============Vehicle APIs=============

  getAllVehicles() {
    return this.http.get(this.url2 + '/', { headers: this.headers });
  }

  getAllAvailableVehicles() {
    return this.http.get(this.url2 + '/available', { headers: this.headers });
  }

  addVehicle(driver) {
    return this.http.post(this.url2 + '/', driver, { headers: this.headers });
  }

  deleteVehicle(id) {
    return this.http.delete(this.url2 + '/' + id, { headers: this.headers });
  }

  updateVehicle(product, id) {
    return this.http.put(this.url2 + '/' + id, product, { headers: this.headers });
  }

  alldrivers(){
    return this.http.get(this.url3 + '/', { headers: this.headers });
  }
}
