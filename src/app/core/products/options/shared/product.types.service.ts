import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorage } from '../../../../auth/token.storage';
import { Observable } from 'rxjs';

@Injectable()

export class ProductOptionService {
    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'token': this.tokenService.getToken()
    });
    ProductOptionsURL = 'api/product/poptions';
    constructor(private http: HttpClient, private tokenService: TokenStorage) { }

    // *************** GET APIS *****************//
    getAllProductOptions(): Observable<Object> {
        return this.http.get(this.ProductOptionsURL + '/all', { headers: this.headers });
    }
    getAllOptionsOfAttributes(ids): Observable<Object> {
        return this.http.post(this.ProductOptionsURL + '/attribute', { attributes: ids }, { headers: this.headers });
    }
    // *************** POST APIS *****************//
    addProductOptions(attributes): Observable<Object> {
        return this.http.post(this.ProductOptionsURL + '/add', attributes, { headers: this.headers });
    }
    // *************** UPDATE APIS *****************//
    updateProductOptions(id, attributes): Observable<Object> {
        return this.http.put(this.ProductOptionsURL + '/update/' + id, attributes, { headers: this.headers });
    }
    // *************** DELETE APIS *****************//
    deleteProductOptions(id): Observable<Object> {
        return this.http.delete(this.ProductOptionsURL + '/delete/' + id, { headers: this.headers });
    }
}
