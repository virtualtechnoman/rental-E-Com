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
  url = '/api/user/customer';
  url2 = '/api/customertype';
  url3 = '/api/distirbutors';
  url4 = '/api/customerassign';
  url5 = '/api/sectors';
  url7 = '/api/customer/addresswithnoroute';
  url6 = '/api/corder/all';
  url8 = '/api/corder/customer';
  url9 = '/api/user/ticket';
  url10 = '/api/subscription/user';
  constructor(private http: HttpClient, private tokenService: TokenStorage) { }

  getAllCustomers() {
    return this.http.get(this.url + '/', { headers: this.headers });
  }

  addCustomer(customer) {
    return this.http.post(this.url + '/', customer, { headers: this.headers });
  }

  deleteCustomer(id) {
    return this.http.delete(this.url + '/' + id, { headers: this.headers });
  }

  updateCustomer(id, customer) {
    return this.http.put(this.url + '/' + id, customer, { headers: this.headers });
  }

  importCustomer(csv) {
    return this.http.post(this.url + '/import', csv);
  }
  // Customers Type

  getAllCustomersTypes() {
    return this.http.get(this.url2 + '/');
  }

  addCustomerTypes(customer) {
    return this.http.post(this.url2 + '/', customer);
  }

  deleteCustomerTypes(id) {
    return this.http.delete(this.url2 + '/' + id);
  }

  updateCustomerTypes(id, customer) {
    return this.http.put(this.url2 + '/' + id, customer);
  }

  importCustomerType(csv) {
    return this.http.post(this.url2 + '/import', csv);
  }

  // Distirbutor

  getAllDistirbutors() {
    return this.http.get(this.url3 + '/');
  }

  addDistirbutors(customer) {
    return this.http.post(this.url3 + '/', customer);
  }

  deleteDistirbutors(id) {
    return this.http.delete(this.url3 + '/' + id);
  }

  updateDistirbutors(id, customer) {
    return this.http.put(this.url3 + '/' + id, customer);
  }

  importDistirbutors(csv) {
    return this.http.post(this.url3 + '/import', csv);
  }

  // ==========================================

  addCustomerAssignment(customer) {
    return this.http.post(this.url4 + '/', customer);
  }

  getCustomerAssigemnet(id) {
    return this.http.get(this.url4 + '/' + id);
  }
  // =============Sector=============================
  getAllSectrors() {
    return this.http.get(this.url5 + '/');
  }

  addSectrors(customer) {
    return this.http.post(this.url5 + '/', customer);
  }

  deleteSectrors(id) {
    return this.http.delete(this.url5 + '/' + id);
  }

  updateSectrors(id, customer) {
    return this.http.put(this.url5 + '/' + id, customer);
  }

  importSectrors(csv) {
    return this.http.post(this.url5 + '/import', csv);
  }

  // Costomer Orders
  getAllCustomersOrders() {
    return this.http.get(this.url6 + '/', { headers: this.headers });
  }

  // Get Customer With No Routes
  getAllCustomersWithNoRotes() {
    return this.http.get(this.url7 + '/', { headers: this.headers });
  }

  // get orders of specific customer
  getSpecificCustomerOrder(id) {
    return this.http.get(this.url8 + '/' + id, { headers: this.headers });
  }

  // get ticket of specific customer
  getSpecificCustomerTickets(id) {
    return this.http.get(this.url9 + '/' + id, { headers: this.headers });
  }

  acceptCustomerOrder(id, product) {
    return this.http.put('api/corder/accept/' + id, product, { headers: this.headers });
  }
  // add subscription

  addSubscriptionn(subscription) {
    return this.http.post(this.url10 + '/', subscription, { headers: this.headers });
  }

  // get subscription of specific user

  getAllSubscriptionspecificCustomer(id) {
    return this.http.get(this.url10 + '/' + id, { headers: this.headers });
  }

  changeCustomerStatus(data) {
    console.log(data);
    return this.http.put('/api/user/changeStatus', data, { headers: this.headers });
  }
}
