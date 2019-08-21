import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorage } from '../../../auth/token.storage';

@Injectable({
    providedIn: 'root'
  })
  
  export class LocationManagerService{

    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'token': this.tokenService.getToken()
      });

      constructor(private http: HttpClient, private tokenService: TokenStorage) { }

      url='/api/state'
      url2='/api/city';
      url3='/api/area';
      url4='/api/user/hub';
      // States
      getAllStates(){
          return this.http.get(this.url + '/' , {headers:this.headers})
      }

      addState(state){
          return this.http.post(this.url + '/' , state, {headers:this.headers})
      }

      deleteState(id){
          return this.http.delete(this.url + '/' + id , {headers:this.headers})
      }

      updateState(state,id){
          return this.http.put(this.url + '/' + id , state, {headers:this.headers})
      }

    //   City

    getAllCity(){
        return this.http.get(this.url2 + '/' , {headers:this.headers})
    }

    addCity(city){
        return this.http.post(this.url2 + '/' , city, {headers:this.headers})
    }

    deleteCity(id){
        return this.http.delete(this.url2 + '/' + id , {headers:this.headers})
    }

    updateCity(city,id){
        return this.http.put(this.url2 + '/' + id , city , {headers:this.headers})
    }

    //  Area

    getAllArea(){
        return this.http.get(this.url3 + '/' , {headers:this.headers})
    }

    addArea(area){
        return this.http.post(this.url3 + '/' , area , {headers:this.headers})
    }

    deleteArea(id){
        return this.http.delete(this.url3 + '/' + id , {headers:this.headers})
    }

    updateArea(area,id){
        return this.http.put(this.url3 + '/' + id , area , {headers:this.headers})
    }

    // Hub Users

    getAllHubUsers(){
        return this.http.get(this.url4 + '/' , {headers:this.headers})
    }
    
  } 