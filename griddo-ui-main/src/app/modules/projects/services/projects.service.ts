import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResModel } from 'src/app/models/res.model';
import { environment } from 'src/environments/environment';
import { ProjectModel, ProjectRes } from '../../sales-grid/components/sales-grid/project-res.model';

export interface TimeZoneModel {
  value: string;
  abbr: string;
  offset: number,
  isdst: false,
  text: string;
  utc: Array<string>
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  towerId: any;
  project!: ProjectModel
  projectEmiter: EventEmitter<ProjectModel> = new EventEmitter();
  constructor(private http: HttpClient) {
  }

  add(formData: any, isEditMode = false) {

    if (!isEditMode)
      return this.http.post<any>(`${environment.api}User/AddProject`, formData);
    else
      return this.http.post<any>(`${environment.api}User/UpdateProject`, formData);

  }


  projects(_params: {
    page?: number, size?: number,
    filterBy?: string, filterValue?: string, isContains?: boolean,
    isAscending?: boolean,
    orderbyColumnName?: string
  }) {
    return this.http.post<any>(`${environment.api}User/GetAllProjects`, { ..._params, totalRecord: 0 });
  }
  getBuilders() {
    return this.http.get<any>(`${environment.api}User/GetBuilderForDropDown`)
  }
  getAmenties() {
    return this.http.get<any>(`${environment.api}User/GetAmenities`)
  }


  getProjectByBuilderForDropDown(builderID: number, page?: number, size?: number) {
    const params = new HttpParams({ fromObject: { UserId: builderID, page: page ?? 1, size: size ?? 100 } });
    return this.http.get<ResModel<Array<{ text: string, value: number }>>>(`${environment.api}User/GetProjectByBuilderForDropDown`, { params });
  }

  getProjectByAgencyForDropDown(agencyId: number, page?: number, size?: number) {
    const params = new HttpParams({ fromObject: { UserId: agencyId, page: page ?? 1, size: size ?? 100 } });
    return this.http.get<ResModel<Array<{ text: string, value: number }>>>(`${environment.api}User/GetProjectByAgencyForDropDown`, { params });
  }

  getProjectByAdminAgentForDropDown(UserId: number, page?: number, size?: number) {
    const params = new HttpParams({ fromObject: { UserId: UserId, page: page ?? 1, size: size ?? 100 } });
    return this.http.get<ResModel<Array<{ value: number, text: string }>>>(`${environment.api}User/GetProjectByAdminAgentForDropDown`, { params });
  }

  getUnitBYProject(projectId: number, page?: number, size?: number) {
    const data = { projectId };
    return this.http.post<ResModel<Array<{ value: number, text: string }>>>(`${environment.api}User/GetUnitBYProject`, data);
  }

  getProjectDetailBYProjectId(projectId: number, refresh = false) {
    // if (this.project?.projectId == projectId && !refresh) {
    //   this.projectEmiter.emit(this.project);
    //   return of({ data: this.project, isSuccess: true } as ProjectRes);
    // }
    this.project = null as any;
    return this.http.post<ProjectRes>(`${environment.api}User/GetProjectDetail?ProjectId=${projectId}`, projectId).pipe(map(res => {
      if (res?.isSuccess && res.data) {
        this.project = res.data;
        this.projectEmiter.emit(this.project);
      }
      return res;
    }));
  }

  getProjectDetailBYProjectIdStepper(projectId: number, refresh = false) {
    // if (this.project?.projectId == projectId && !refresh) {
    //   this.projectEmiter.emit(this.project);
    //   return of({ data: this.project, isSuccess: true } as ProjectRes);
    // }
    this.project = null as any;
    return this.http.post<ProjectRes>(`${environment.api}User/GetProjectDetail?ProjectId=${projectId}`, projectId).pipe(map(res => {
      if (res?.isSuccess && res.data) {
        this.project = res.data;
        this.projectEmiter.emit(this.project);
      }
      return res;
    }));
  }

  timeZones = () => this.http.get<Array<TimeZoneModel>>(`/assets/json/timezones.json`);



  getSkipMaster() {
    return this.http.get<any>(`${environment.api}User/GetSkipMaster`);
  }
  updateFlatActionStatus(data: { flatIds: Array<any>, status: string }) {
    return this.http.post<any>(`${environment.api}User/UpdateFlatActionStatus`, data);
  }

  splitFlat(data: { flatId: number, flatno: number }) {
    return this.http.post<any>(`${environment.api}User/SplitFlat`, data);
  }

  mergeFlat(data: { flatIds: Array<any>, status: boolean }) {
    return this.http.post<any>(`${environment.api}User/MergeFlat`, data);
  }

  assignedAgentToFlat(data: { flatIds: Array<number>, agentId: number }) {
    return this.http.post<any>(`${environment.api}User/AssignedAgentToFlat`, data);
  }

  revokeAgentFromFlat(data: { flatIds: Array<number>, agentId: any }) {
    return this.http.post<any>(`${environment.api}User/RevokeAgentFromFlat`, data);
  }

  getAgentForDropDown() {
    return this.http.get<any>(`${environment.api}User/GetAgentForDropDown`);
  }

  getInternalAgentForDropDown(builderId) {
    return this.http.get<any>(`${environment.api}User/GetInternalAgentForDropDown?builderId=${builderId}`);
  }

  getExternalAgentForDropDown() {
    return this.http.get<any>(`${environment.api}User/GetExternalAgentForDropDown`);
  }

  getAgencyForDropDown() {
    return this.http.get<any>(`${environment.api}User/GetAgencyForDropDown`);
  }

  flatDetail(flatId: number) {
    return this.http.post<any>(`${environment.api}User/FlatDetail`, { flatId });
  }

  flatDetailPage(projectId: number, flatId: number, towerId: number) {
    const params = new HttpParams({ fromObject: { projectId, flatId, towerId } });
    return this.http.get<any>(`${environment.api}User/GetSalesGrid`, { params });
  }

  CreateEnvelop(fb: any) {
    return this.http.post<any>(`${environment.api}Docusign/CreateEnvelop`, fb);
  }

  updateFlatDetail(obj: any) {
    return this.http.post<any>(`${environment.api}User/UpdateFlatPrice`, obj);
  }
  getProjectsByAgency(userId: any) {

    return this.http.get<any>(`${environment.api}User/GetProjectDetailByAgency?UserId=${userId} `);
  }

  AddSalesGridNote(obj: any) {
    return this.http.post<any>(`${environment.api}User/AddSalesGridNote`, obj);
  }

  ProjectSalesGridNote() {

    return this.http.get<any>(`${environment.api}User/GetSalesGrid `);
  }
}

