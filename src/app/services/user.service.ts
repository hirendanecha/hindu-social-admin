import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.serverUrl + 'customers';
  constructor(private http: HttpClient) { }

  login(login: any): Observable<Object> {
    const url = environment.serverUrl;
    return this.http.post(`${url}login/admin`, {
      email: login.Email,
      password: login.Password,
    });
  }

  userList(
    page: number,
    size: number,
    search: string = '',
    startDate,
    endDate
  ): Observable<any> {
    const data = {
      page: page,
      size: size,
      search: search,
      startDate: startDate,
      endDate: endDate,
    };
    return this.http.post(`${this.baseUrl}`, data);
  }

  getUserDetailsById(Id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/${Id}`);
  }

  changeUserStatus(id, status): Observable<any> {
    const userId = id;
    const IsActive = status;
    return this.http.get(
      `${this.baseUrl}/change-status/${userId}?IsActive=${IsActive}`
    );
  }

  changeAccountType(id, status): Observable<any> {
    const userId = id;
    const type = status;
    return this.http.get(
      `${this.baseUrl}/change-user-type/${userId}?type=${type}`
    );
  }

  suspendUser(id, status): Observable<any> {
    const userId = id;
    const IsSuspended = status;
    return this.http.get(
      `${this.baseUrl}/suspend-user/${userId}?IsSuspended=${IsSuspended}`
    );
  }

  activateMedia(id, status): Observable<any> {
    const userId = id;
    const IsSuspended = status;
    return this.http.get(
      `${this.baseUrl}/activate-media/${userId}?MediaApproved=${IsSuspended}`
    );
  }

  deleteUser(id): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getUserList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get`);
  }

  getProfileList(searchText: string = ''): Observable<object> {
    return this.http.get(
      `${this.baseUrl}/search-user?searchText=${searchText}`
    );
  }

  getCountriesData(): Observable<{ country_code: string; country: string }[]> {
    return this.http.get<{ country_code: string; country: string }[]>(
      `${this.baseUrl}/countries`
    );
  }

  getZipData(zip: string, country: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/zip/${zip}?country=${country}`);
  }

  updateProfile(id, customer): Observable<Object> {
    return this.http.put(`${this.baseUrl}/profile/${id}`, customer);
  }

  getUserEmailList(data): Observable<any> {
    return this.http.post(`${this.baseUrl}/get-emails`, data);
  }
}
