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
export class CommunityService {
  private baseUrl = environment.serverUrl + 'community';
  constructor(private http: HttpClient) { }

  getAllCommunity(page: number, size: number, search: string = '', pageType: string, startDate, endDate): Observable<any> {
    const data = {
      page: page,
      size: size,
      search: search,
      pageType: pageType,
      startDate: startDate,
      endDate: endDate
    }
    return this.http.post(
      `${this.baseUrl}/all-community/`, data
    );
  }

  getUnApproveCommunity(page: number, size: number, search, pageType: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/un-approve-community/?page=${page}&size=${size}&search=${search}&pageType=${pageType}`
    );
  }

  changeCommunityStatus(id, pId, status): Observable<any> {
    const communityId = id;
    const profileId = pId;
    const IsApprove = status;
    return this.http.get(
      `${this.baseUrl}/status/${communityId}?IsApprove=${IsApprove}&profileId=${profileId}`
    );
  }

  deleteCommunity(id): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getCommunityById(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  searchCommunity(searchText, page, size): Observable<any> {
    return this.http.get(
      `${this.baseUrl
      }/search/?searchText=${searchText.trim()}&?page=${page}&size=${size}`
    );
  }

  createCommunityAdminByMA(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/create-community-admin-by-MA`,
      data
    );
  }

  removeFromCommunity(id, profileId): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/leave?communityId=${id}&profileId=${profileId}`
    );
  }
}
