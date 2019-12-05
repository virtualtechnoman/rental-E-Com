import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorage } from '../../../../auth/token.storage';
import { Observable } from 'rxjs';

@Injectable()

export class AttributesService {
    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'token': this.tokenService.getToken()
    });
    attributesURL = 'api/product/pattribute';
    optionsURL = 'api/product/poptions'
    constructor(private http: HttpClient, private tokenService: TokenStorage) { }

    // *************** GET APIS *****************//
    getAllAttributes(): Observable<Object> {
        return this.http.get(this.attributesURL + '/all', { headers: this.headers });
    }

    // *************** POST APIS *****************//
    addAttributes(attributes): Observable<Object> {
        return this.http.post(this.attributesURL + '/add', attributes, { headers: this.headers });
    }
    // *************** UPDATE APIS *****************//
    updateAttributes(id, attributes): Observable<Object> {
        return this.http.put(this.attributesURL + '/update/' + id, attributes, { headers: this.headers });
    }

    updateAttributeOptions(id, optionValue): Observable<Object> {
        return this.http.put(this.optionsURL + '/update/' + id, optionValue, { headers: this.headers });
    }
    // *************** DELETE APIS *****************//
    deleteAttributes(id): Observable<Object> {
        return this.http.delete(this.attributesURL + '/delete/' + id, { headers: this.headers });
    }

    deleteSelectedOption(id): Observable<Object> {
        return this.http.delete(this.optionsURL + '/delete/' + id, { headers: this.headers });
    }
}
