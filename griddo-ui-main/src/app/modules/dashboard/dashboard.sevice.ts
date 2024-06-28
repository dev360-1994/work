import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITS_JUST_ANGULAR } from '@angular/core/src/r3_symbols';
import { ResModel } from 'src/app/models/res.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {
  }

  getAdminDashboard() {
    return this.http.get(`${environment.api}Dashboard/AdminDashboard`);
  }

}
