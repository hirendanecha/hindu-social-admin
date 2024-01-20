import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class CommunityPostService {
  private baseUrl = environment.serverUrl + 'community-post';
  constructor(private http: HttpClient) {}

  deletePost(id): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  searchUser(page, size, search): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/?page=${page}&size=${size}&search=${search}`
    );
  }

  getPostList(page, size, search): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/?page=${page}&size=${size}&search=${search}`
    );
  }
  
  viewPost(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/get/${id}`);
  }
}
