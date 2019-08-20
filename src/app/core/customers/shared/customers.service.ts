import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorage } from '../../../auth/token.storage';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'token': this.tokenService.getToken()
  });
  url = "/api/customer"
  url2 = "/api/customertype"
  url3 = "/api/distirbutors"
  url4 = "/api/customerassign"
  url5 = "/api/sectors"
  constructor(private http: HttpClient,private tokenService:TokenStorage) { }

  getAllCustomers() {
    return this.http.get(this.url + '/', { headers: this.headers })
  }

  addCustomer(customer) {
    return this.http.post(this.url + '/', customer,{ headers: this.headers });
  }

  deleteCustomer(id) {
    return this.http.delete(this.url + '/' + id, { headers: this.headers })
  }

  updateCustomer(id, customer) {
    return this.http.put(this.url + '/' + id, customer, { headers: this.headers });
  }

  importCustomer(csv) {
    return this.http.post(this.url + '/import', csv)
  }
  //customers Type

  getAllCustomersTypes() {
    return this.http.get(this.url2 + '/')
  }

  addCustomerTypes(customer) {
    return this.http.post(this.url2 + '/', customer);
  }

  deleteCustomerTypes(id) {
    return this.http.delete(this.url2 + '/' + id)
  }

  updateCustomerTypes(id, customer) {
    return this.http.put(this.url2 + '/' + id, customer);
  }

  importCustomerType(csv) {
    return this.http.post(this.url2 + '/import', csv)
  }

  // Distirbutor

  getAllDistirbutors() {
    return this.http.get(this.url3 + '/')
  }

  addDistirbutors(customer) {
    return this.http.post(this.url3 + '/', customer);
  }

  deleteDistirbutors(id) {
    return this.http.delete(this.url3 + '/' + id)
  }

  updateDistirbutors(id, customer) {
    return this.http.put(this.url3 + '/' + id, customer);
  }

  importDistirbutors(csv) {
    return this.http.post(this.url3 + '/import', csv)
  }

  // ==========================================

  addCustomerAssignment(customer) {
    return this.http.post(this.url4 + '/', customer)
  }

  getCustomerAssigemnet(id){
    return this.http.get(this.url4+'/'+id)
  }
// =============Sector=============================
  getAllSectrors() {
    return this.http.get(this.url5 + '/')
  }

  addSectrors(customer) {
    return this.http.post(this.url5 + '/', customer);
  }

  deleteSectrors(id) {
    return this.http.delete(this.url5 + '/' + id)
  }

  updateSectrors(id, customer) {
    return this.http.put(this.url5 + '/' + id, customer);
  }

  importSectrors(csv) {
    return this.http.post(this.url5 + '/import', csv)
  }

}
