import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class AdvertisementService {
  private baseUrl = environment.serverUrl + 'advertizement';
  constructor(private http: HttpClient) { }

  getAdvertisement(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get`);
  }

  getAdvertisementData(data): Observable<any> {
    return this.http.post(`${this.baseUrl}/addEditAdvertizement`, data);
  }

  deleteAdvertisement(id): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
}
