import { HttpHeaders, HttpClient } from "@angular/common/http";
import { TokenStorage } from "../../../auth/token.storage";
import { Injectable } from "@angular/core";

@Injectable()

export class ProductVarientService {
    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'token': this.tokenService.getToken()
    });

    productVarientURL = '/api/product/pvarients';
    constructor(private http: HttpClient, private tokenService: TokenStorage) { }

    getAllProductVarients() {
        return this.http.get(this.productVarientURL + '/all', { headers: this.headers });
    }

    getAllVarientsOfProduct(id) {
        return this.http.get(this.productVarientURL + '/byproduct/' + id, { headers: this.headers });
    }

    addNewProductVarients(varient) {
        console.log(varient);
        return this.http.post(this.productVarientURL + '/add', varient, { headers: this.headers });
    }
}
