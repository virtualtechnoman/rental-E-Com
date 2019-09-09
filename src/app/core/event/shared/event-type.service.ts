import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorage } from '../../../auth/token.storage';

@Injectable({
    providedIn: 'root'
})

export class EventService {
    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'token': this.tokenService.getToken()
    });
    constructor(private http: HttpClient, private tokenService: TokenStorage) { }
    //   Event Type Api
    url = '/api/event/type';
    url2 = 'api/event/organizer';
    url3 = 'api/mktmat';
    url4= "/api/event";
    url5= "/api/event/lead";
    // States
    getAllEvent() {
        return this.http.get(this.url + '/', { headers: this.headers });
    }

    addEvent(event) {
        return this.http.post(this.url + '/', event, { headers: this.headers });
    }

    deleteEvent(id) {
        return this.http.delete(this.url + '/' + id, { headers: this.headers });
    }

    updateEvent(event, id) {
        return this.http.put(this.url + '/' + id, event, { headers: this.headers });
    }

    //   Event Organizer Api

    getAllEventOrganizer() {
        return this.http.get(this.url2 + '/', { headers: this.headers });
    }

    addEventOrganizer(event) {
        return this.http.post(this.url2 + '/', event, { headers: this.headers });
    }

    deleteEventOrganizer(id) {
        return this.http.delete(this.url2 + '/' + id, { headers: this.headers });
    }

    updateEventOrganizer(event, id) {
        return this.http.put(this.url2 + '/id/' + id, event, { headers: this.headers });
    }

    // Marketing Material Api

    getAllMarketingMaterial() {
        return this.http.get(this.url3 + '/', { headers: this.headers });
    }

    addMarketingMaterial(material) {
        return this.http.post(this.url3 + '/', material, { headers: this.headers });
    }

    deleteMarketingMaterial(id) {
        return this.http.delete(this.url3 + '/' + id, { headers: this.headers });
    }

    updateMarketingMaterial(material, id) {
        return this.http.put(this.url3 + '/' + id, material, { headers: this.headers });
    }

    // Main Event

    getAllMainEvent() {
        return this.http.get(this.url4+ '/all', { headers: this.headers });
    }

    addMainEvent(event) {
        return this.http.post(this.url4 + '/', event, { headers: this.headers });
    }

    
    // Cancel Main Event

    updateStatusMainEvent(id) {
        return this.http.put(this.url4 + '/cancel/' + id, {} , { headers: this.headers });
    }

    // Lead Api

    getAllLeads() {
        return this.http.get(this.url5+ '/', { headers: this.headers });
    }

    addLead(lead) {
        return this.http.post(this.url5 + '/', lead, { headers: this.headers });
    }

    // Get Lead Comments Array

    updateCommentsLead(comment,id) {
        return this.http.put(this.url5 + '/comment/' + id, comment, { headers: this.headers });
    }

} 
