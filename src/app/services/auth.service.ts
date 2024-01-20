import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  LOCALSTORAGE = {
    USER: 'user',
  };

  isAuthenticated(): boolean {
    let user = localStorage.getItem(this.LOCALSTORAGE.USER);
    return !user ? false : true;
  }

  setUser(user) {
    if (user != null && user != undefined) {
      localStorage.setItem(this.LOCALSTORAGE.USER, JSON.stringify(user));
    }
  }

  getCurrentUserDatatFromLocalStorage() {
    let data = localStorage.getItem(this.LOCALSTORAGE.USER);
    if (data != undefined && data != null && data != '') {
      const loginUser = JSON.parse(data);
      return loginUser;
    }
    return null;
  }
}
