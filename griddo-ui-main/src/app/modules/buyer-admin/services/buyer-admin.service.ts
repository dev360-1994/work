import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuyerAdminService {

  constructor(private http: HttpClient) { }

  getBuyerProjects(loginId: string) {
    const params = new HttpParams({ fromObject: { loginId } })
    return this.http.get<any>(`${environment.api}User/GetBuyerProjects`, { params });
  }

  getBuyerProjectDetail(loginId: string, projectId: number) {
    const params = new HttpParams({ fromObject: { loginId, projectId } })
    return this.http.get<any>(`${environment.api}User/GetBuyerProjectDetail`, { params });
  }

  uploadDocument(obj: any) {
    return this.http.post<any>(`${environment.api}User/UploadBuyerDocument`, obj);
  }
}
