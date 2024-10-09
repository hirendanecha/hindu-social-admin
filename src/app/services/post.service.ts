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
export class PostService {
  private baseUrl = environment.serverUrl + 'posts';
  constructor(private http: HttpClient) { }

  hidePost(id, isdeleted): Observable<any> {
    return this.http.delete(`${this.baseUrl}/hide-post/${id}?isDeleted=${isdeleted}`);
  }

  deletePost(id): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getPostList(page, size, search): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/?page=${page}&size=${size}&search=${search}`
    );
  }

  getPostsByPostId(id) {
    return this.http.get(`${this.baseUrl}/get/${id}`);
  }

  getPostDetails(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/get/${id}`);
  }

  // viewPost(id, startDate: string = '', endDate: string = ''): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/${id}?startDate=${startDate}&endDate=${endDate}`);
  // }

  getAllPost(data): Observable<any> {
    return this.http.post(`${this.baseUrl}/get-all-posts`, data);
  }
  
  viewPost(data): Observable<any> {
    return this.http.post(`${this.baseUrl}/get-my-post`, data);
  }
  
  getComments(data): Observable<any> {
    return this.http.post(`${this.baseUrl}/comments`, data);
  }

  deleteComments(id): Observable<any> {
    return this.http.delete(`${this.baseUrl}/comments/${id}`);
  }

    
  deleteAllData(id): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-all/${id}`);
  }
}
