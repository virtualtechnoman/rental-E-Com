import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorage } from '../../../../auth/token.storage';
import { Observable } from 'rxjs';

@Injectable()

export class ProductTypeService {
    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'token': this.tokenService.getToken()
    });
    productTypeURL = 'api/ptype';
    constructor(private http: HttpClient, private tokenService: TokenStorage) { }

    // *************** GET APIS *****************//
    getAllProductType(): Observable<Object> {
        return this.http.get(this.productTypeURL + '/all', { headers: this.headers });
    }
    // *************** POST APIS *****************//
    addProductType(attributes): Observable<Object> {
        return this.http.post(this.productTypeURL + '/add', attributes, { headers: this.headers });
    }
    // *************** UPDATE APIS *****************//
    updateProductType(id, attributes): Observable<Object> {
        return this.http.put(this.productTypeURL + '/update/' + id, attributes, { headers: this.headers });
    }
    // *************** DELETE APIS *****************//
    deleteProductType(id): Observable<Object> {
        return this.http.delete(this.productTypeURL + '/delete/' + id, { headers: this.headers });
    }
}
