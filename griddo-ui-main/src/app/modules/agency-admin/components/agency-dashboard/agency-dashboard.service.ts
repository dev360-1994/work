import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgencyDashboardService {
  constructor(private http: HttpClient) {
  }

  getAgencyDashboard(id) {
    return this.http.get(`${environment.api}Dashboard/AgencyDashboard?userId=${id}`);
  }

}
