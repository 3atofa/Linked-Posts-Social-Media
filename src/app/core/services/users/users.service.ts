import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private readonly httpClient: HttpClient) { }

  userData:any = null;

  saveUserData() {
    if (localStorage.getItem('socialToken') != null) {
      this.userData = jwtDecode(localStorage.getItem('socialToken')!);
    }
  }

  signUp(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseURL}users/signup`, data)
  }

  signIn(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseURL}users/signin`, data);
  }

  changePassword(data: object): Observable<any> {
    return this.httpClient.patch(`${environment.baseURL}users/change-password`, data)
  }

  uploadProfileImage(data: FormData): Observable<any> {
    return this.httpClient.put(`${environment.baseURL}users/upload-photo`, data,)
  }

  getLoggedUserData(): Observable<any> {
    return this.httpClient.get(`${environment.baseURL}users/profile-data`)
  }
}
