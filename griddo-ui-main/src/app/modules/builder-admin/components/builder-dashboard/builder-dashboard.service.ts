import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuilderDashboardService {
  constructor(private http: HttpClient) {
  }

  getBuilderDashboard(id) {
    return this.http.get(`${environment.api}Dashboard/BuilderDashboard?userId=${id}`);
  }

}
