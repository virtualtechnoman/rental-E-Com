import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';


@Injectable()

export class ProductsService {
  url = "/api/products"
  constructor(private http: HttpClient) { }

  getAllProduct() {
    return this.http.get(this.url + '/')
  }

  addProduct(product) {
    return this.http.post(this.url + '/', product);
  }

  deleteProduct(id) {
    return this.http.delete(this.url + '/' + id);
  }

  updateProduct(product) {
    return this.http.put(this.url, product);
  }
  
  importCustomer(csv){
    return this.http.post(this.url+'/import',csv)
  }
}