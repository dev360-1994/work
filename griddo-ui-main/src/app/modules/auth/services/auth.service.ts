import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {

  }

  login(payload: any) {
    return this.http.post<User>(`${environment.api}Account/authenticate`, payload);
  }

  emailVerify(payload: any) {
    let params = new HttpParams({ fromObject: payload })
    return this.http.get<User>(`${environment.api}Account/confirm-email`, { params });
  }

  forgotPassword(email: string) {
    let params = new HttpParams({ fromObject: { email } })
    return this.http.get<User>(`${environment.api}Account/forgotPassword`, { params });
  }

  resetPassword(email: string, token: string, password: string) {
    let params = new HttpParams({ fromObject: { email, token, password } })
    return this.http.post<User>(`${environment.api}Account/resetPassword`, {}, { params });
  }
}
