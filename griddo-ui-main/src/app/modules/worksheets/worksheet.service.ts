import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITS_JUST_ANGULAR } from '@angular/core/src/r3_symbols';
import { ResModel } from 'src/app/models/res.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorksheetService {
  constructor(private http: HttpClient) {
  }

  add(worksheet: any) {
    return this.http.post<any>(`${environment.api}User/AddProjectWorkSheet`, worksheet);
  }

  worksheets(obj: any) {
    //const params = new HttpParams({ fromObject: { page: page ?? 1, size: size ?? 10 } });
    return this.http.post<ResModel<Array<any>>>(`${environment.api}User/GetWorkSheet`, obj);
  }

  worksheetByID(ProjectWorksheetId: number, loginId: string) {
    return this.http.post<ResModel<Array<any>>>(`${environment.api}User/GetWorkSheetByID`, { ProjectWorksheetId, loginId });
  }

  assignWorksheet(obj: any) {
    return this.http.post<ResModel<Array<any>>>(`${environment.api}User/AssignProjectWorksheet`, obj);
  }

  getUnitBYProject(projectId: number) {
    const data = { projectId };
    return this.http.post<ResModel<Array<{ value: number, text: string }>>>(`${environment.api}User/GetUnitBYProject`, data);
  }

  postComment(data: any) {
    return this.http.post<ResModel<Array<any>>>(`${environment.api}User/AddWorkSheetComment`, data);
  }

  generateWorksheetAPSDoc(data: any) {
    return this.http.post<ResModel<Array<any>>>(`${environment.api}User/CreateWorksheetDocument`, data);
  }

  updatePurchaser(data: any) {
    return this.http.post<ResModel<Array<any>>>(`${environment.api}User/UpdateWorksheetPurchaser`, data);
  }

  addPurchaser(data: any) {
    return this.http.post<ResModel<Array<any>>>(`${environment.api}User/UpdateWorksheetPurchaser`, data);
  }

  deletePurchaser(purchaserId: any) {
    const params = new HttpParams({ fromObject: { purchaserId } });
    return this.http.delete<ResModel<any>>(`${environment.api}User/DeleteWorksheetPurchaser`, { params });
  }

  updateDealStatus(data: any) {
    return this.http.put<ResModel<any>>(`${environment.api}User/UpdateDealStatus`, data);
  }

  updateWorksheetUnitPrice(data: any) {
    return this.http.put<ResModel<any>>(`${environment.api}User/UpdateWorksheetUnitPrice`, data);
  }

}
