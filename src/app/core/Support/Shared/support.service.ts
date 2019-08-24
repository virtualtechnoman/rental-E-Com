import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorage } from '../../../auth/token.storage';

@Injectable({
    providedIn: 'root'
  })
  
  export class SupportService{

    url= '/api/ticket';

    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'token': this.tokenService.getToken()
      });
      constructor(private http: HttpClient, private tokenService: TokenStorage) { }

      // Tickets

      getAllTickets(){
        return this.http.get(this.url + '/' , { headers:this.headers} )
      }


  }