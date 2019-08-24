import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorage } from '../../../auth/token.storage';

@Injectable({
    providedIn: 'root'
  })
  
  export class SupportService{

    url= '/api/support/ticket';
    url2 = '/api/support/ticket';
    url3 = '/api/support/ticket/id';
    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'token': this.tokenService.getToken()
      });
      constructor(private http: HttpClient, private tokenService: TokenStorage) { }

      // Tickets

      getAllTickets(){
        return this.http.get(this.url + '/' , { headers:this.headers} )
      }

      addTicket(ticket){
        return this.http.post(this.url + '/' , ticket , {headers:this.headers})
      }

      getTicketInfo(id){
        return this.http.get(this.url3 + '/' + id , { headers:this.headers} )
      }

  }