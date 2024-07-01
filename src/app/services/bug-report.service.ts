import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BugReportService {
  private baseUrl = environment.serverUrl + 'bugs-reports';
  constructor(private http: HttpClient) {}

  getBugreport(data: any): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  getBugreportById(id: any): Observable<Object> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  changeBugStatus(data: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/change-status`, data);
  }

  deleteReport(id: number): Observable<Object> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
}
