import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorage } from "../../../auth/token.storage";


@Injectable()

export class ProductsService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'token': this.tokenService.getToken()
  });
  url = "/api/products"
  constructor(private http: HttpClient, private tokenService: TokenStorage) { }

  getAllProduct() {
    return this.http.get(this.url + '/', { headers: this.headers })
  }

  addProduct(product) {
    return this.http.post(this.url + '/', product, { headers: this.headers });
  }

  deleteProduct(id) {
    return this.http.delete(this.url + '/' + id, { headers: this.headers });
  }

  updateProduct(product) {
    return this.http.put(this.url, product, { headers: this.headers });
  }

  importCustomer(csv) {
    return this.http.post(this.url + '/import', csv)
  }
}