import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Builder } from 'src/app/models/builder.model';
import { ResModel } from 'src/app/models/res.model';


@Injectable({
  providedIn: 'root'
})
export class AgencyService {

  constructor(private http: HttpClient) {

  }

  add(agency: any) {
    const formData = new FormData();
    Object.keys(agency).forEach(key => {
      if (agency[key]) {
        formData.append(key, agency[key])
      }
    });
    return this.http.post<ResModel<any>>(`${environment.api}User/AddAgency`, formData);
  }

  update(agency: any, agencyId: number) {
    const formData = new FormData();
    formData.append('AgencyId', agencyId.toString());
    Object.keys(agency).forEach(key => {
      if (agency[key]) {
        formData.append(key, agency[key])
      }
    });
    return this.http.put<ResModel<any>>(`${environment.api}User/UpdateAgency`, formData);
  }

  agency(_params: {
    page?: number, size?: number,
    FilterBy?: string, FilterValue?: string,
    IsAsc?: boolean,
    OrderBy?: string
  }) {
    const params = new HttpParams({ fromObject: _params });
    return this.http.get<ResModel<Array<any>>>(`${environment.api}User/GetAgency`, { params });
  }

  agent(AgencyId: number) {
    const params = new HttpParams({ fromObject: { AgencyId } });
    return this.http.get<ResModel<any>>(`${environment.api}User/GetAgencyDetail`, { params });
  }

  delete(AgencyId: number) {
    const params = new HttpParams({ fromObject: { AgencyId } });
    return this.http.delete<ResModel<any>>(`${environment.api}User/DeleteAgency`, { params });
  }
}
