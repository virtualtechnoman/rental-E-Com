import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorage } from "../../../auth/token.storage";


@Injectable()

export class ProductsService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'token': this.tokenService.getToken()
  });
  url = '/api/products';
  url2='/api/pcategory';
  url3 ='/api/brand'
  url4='/api/user/hub';
  constructor(private http: HttpClient, private tokenService: TokenStorage) { }

  getAllProduct() {
    return this.http.get(this.url + '/all', { headers: this.headers });
  }

  addProduct(product) {
    return this.http.post(this.url + '/', product, { headers: this.headers });
  }

  deleteProduct(id) {
    return this.http.delete(this.url + '/' + id, { headers: this.headers });
  }

  updateProduct(product, id) {
    return this.http.put(this.url + '/' + id, product, { headers: this.headers });
  }

  importCustomer(csv) {
    return this.http.post(this.url + '/import', csv);
  }

  getAllCategory(){
    return this.http.get(this.url2 + '/all', { headers: this.headers })
  }

  addCategory(category){
    return this.http.post(this.url2 + '/', category, { headers: this.headers })
  }

  deleteCategory(id){
    return this.http.delete(this.url2 + '/' + id, { headers: this.headers })
  }

  updateCategory(category,id) {
    return this.http.put(this.url2 + '/' + id, category, { headers: this.headers });
  }

  // Brand API

  getAllBrand() {
    return this.http.get(this.url3 + '/', { headers: this.headers });
  }

  addBrand(brand) {
    return this.http.post(this.url3 + '/', brand, { headers: this.headers });
  }

  deleteBrand(id) {
    return this.http.delete(this.url3 + '/' + id, { headers: this.headers });
  }

  updateBrand(brand, id) {
    return this.http.put(this.url3 + '/' + id,brand, { headers: this.headers });
  }

  // Hub User

  getAllHub(){
    return this.http.get(this.url4 + '/' , {headers:this.headers})
  }
}