import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResModel } from 'src/app/models/res.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DealService {
  constructor(private http: HttpClient) {
  }

  getDeals(obj: any) {
    return this.http.post<ResModel<Array<any>>>(`${environment.api}User/GetDeals`, obj);
  }

  generateWorksheetAPSDoc(data: any){
    return this.http.post<ResModel<Array<any>>>(`${environment.api}User/CreateWorksheetDocument`, data);
  }

}
