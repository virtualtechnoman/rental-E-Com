import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorage } from '../../../../auth/token.storage';


@Injectable()

export class ProductsCategoryService {
    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'token': this.tokenService.getToken()
    });
    headersFormData = new HttpHeaders({
        'token': this.tokenService.getToken()
    });
    productCategoryURL = 'api/product/pcategory';
    constructor(private http: HttpClient, private tokenService: TokenStorage) { }
    getAllCategory() {
        return this.http.get(this.productCategoryURL + '/all', { headers: this.headers });
    }

    getAllCategorysub(id) {
        return this.http.get(this.productCategoryURL + '/subcat/all/' + id, { headers: this.headers });
    }

    addCategory(category) {
        return this.http.post(this.productCategoryURL + '/', category, { headers: this.headersFormData });
    }

    deleteCategory(id) {
        return this.http.delete(this.productCategoryURL + '/' + id, { headers: this.headers });
    }

    updateCategory(category, id) {
        return this.http.put(this.productCategoryURL + '/' + id, category, { headers: this.headersFormData });
    }
}
