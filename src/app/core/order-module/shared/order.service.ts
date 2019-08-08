import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorage } from '../../../auth/token.storage';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'token': this.tokenService.getToken()
  });

  url = "/api/order";
  url2 = "/api/rorder";
  constructor(private http: HttpClient, private tokenService: TokenStorage) { }

  // ==========ORDER APIS=================//
  getAllOrders() {
    return this.http.get(this.url + '/', { headers: this.headers })
  }

  addOrder(order) {
    return this.http.post(this.url + '/', order, { headers: this.headers });
  }

  deleteOrder(id) {
    return this.http.delete(this.url + '/' + id, { headers: this.headers });
  }

  updateOrder(order, id) {
    return this.http.put(this.url + '/' + id, order, { headers: this.headers });
  }

  // =================RETURN ORDER APIS==================//
  getAllReturnOrders() {
    return this.http.get(this.url2 + '/', { headers: this.headers })
  }

  addReturnOrder(returnOrder) {
    return this.http.post(this.url2 + '/', returnOrder, { headers: this.headers });
  }

  deleteReturnOrder(id) {
    return this.http.delete(this.url2 + '/' + id, { headers: this.headers });
  }

  updateReturnOrder(returnOrder) {
    return this.http.put(this.url2, returnOrder, { headers: this.headers });
  }
}
