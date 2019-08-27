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

  url = '/api/order';
  url2 = '/api/rorder';
  url3 = '/api/challan/type/order';
  url4 = '/api/user';
  url5 = '/api/order/gchallan';
  url6 = '/api/order/accept';
  url7 = '/api/orderstatus/after';
  url8 = '/api/order/setstatus';
  url9 = '/api/challan/accept';
  url10= '/api/order/recieve';
  url11= '/api/order/bill';
  url12= '/api/user/farm';
  url13= '/api/rorder/gchallan';
  url14= '/api/challan/type/rorder';
  url15= '/api/rorder/recieve';
  url16= '/api/rorder/bill';
  constructor(private http: HttpClient, private tokenService: TokenStorage) { }

  // ==========ORDER APIS=================//
  getAllOrders() {
    return this.http.get(this.url + '/', { headers: this.headers });
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
  // getAllReturnOrders() {
  //   return this.http.get(this.url2 + '/', { headers: this.headers });
  // }

  addReturnOrder(returnOrder) {
    return this.http.post(this.url2 + '/', returnOrder, { headers: this.headers });
  }

  deleteReturnOrder(id) {
    return this.http.delete(this.url2 + '/' + id, { headers: this.headers });
  }

  updateReturnOrder(returnOrder) {
    return this.http.put(this.url2, returnOrder, { headers: this.headers });
  }

  // =================CHALLAN APIS==================//
  getAllChallan() {
    console.log(this.headers)
    return this.http.get(this.url3, { headers: this.headers });
  }

  getOwnChallan() {
    return this.http.get(this.url3 + '/', { headers: this.headers });
  }

  getSpecificChallan(id) {
    return this.http.get(this.url3 + '/id' + id, { headers: this.headers });
  }

  deleteChallan(id) {
    return this.http.delete(this.url3 + '/' + id, { headers: this.headers });
  }

  addNewChallan(challan) {
    return this.http.post(this.url3, challan, { headers: this.headers });
  }

  getUsers() {
    return this.http.get(this.url4 + '/', { headers: this.headers });
  }

  // updateChallanStatus(id, status) {
  //   return this.http.put(this.url3 + '/' + id, status, { headers: this.headers });
  // }

  // Order Challan

  addOrderChallan(challan, id) {
    return this.http.post(this.url5 + '/' + id, challan, { headers: this.headers });
  }

  // Return Order Challan

  addReturnOrderChallan(challan, id) {
    return this.http.post(this.url13 + '/' + id, challan, { headers: this.headers });
  }

  // Accept Order API
  addAcceptedOrder(id, order) {
    return this.http.put(this.url6 + '/' + id, order, { headers: this.headers });
  }

  // Get Next Statuses

  getAfterStatus(id) {
    return this.http.get(this.url7 + '/' + id, { headers: this.headers });
  }

  // Set Order Status

  setOrderStatus(id, status) {
    return this.http.put(this.url8 + '/' + id, status, { headers: this.headers });
  }

  // Accept Challan

  updateChallanStatus(id) {
    // console.log("headers of accept challan", this.headers)
    return this.http.put(this.url9 + '/' + id, { }, { headers: this.headers });
  }

  // Recieved Challan Quantity
  recievedChallanStatus(id,recieved) {
    return this.http.put(this.url10 + '/' + id, recieved, { headers: this.headers });
  }

  // Bill Challan Quantity 
  recievedBillQuantity(id,billed) {
    return this.http.put(this.url11 + '/' + id, billed , { headers: this.headers });
  }

  // GET FARMS

  getAllFarms() {
    return this.http.get(this.url12 + '/', { headers: this.headers });
  }

  // Get ALL REturn Orders

  getAllReturnOrders(){
    return this.http.get(this.url2 + '/', { headers: this.headers });

  }

  // Update Return Order Challan Status

  updateReturnOrderChallanStatus(id) {
    // console.log("headers of accept challan", this.headers)
    return this.http.put(this.url9 + '/' + id, { }, { headers: this.headers });
  }

  getAllReturnOrdersChallans(){
    return this.http.get(this.url14 + '/', { headers: this.headers });

  }

  // Recieved Order Value

  recievedQuantityStatus(id,recieved) {
    return this.http.put(this.url15 + '/' + id, recieved, { headers: this.headers });
  }

  // Bill Quantity Value

  recievedBillStatus(id,bill) {
    return this.http.put(this.url16 + '/' + id, bill, { headers: this.headers });
  }
}
