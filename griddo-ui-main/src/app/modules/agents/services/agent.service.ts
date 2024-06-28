import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResModel } from 'src/app/models/res.model';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  constructor(private http: HttpClient) {

  }

  add(agent: any) {
    const formData = new FormData();
    Object.keys(agent).forEach(key => {
      if (agent[key]) {
        formData.append(key, agent[key])
      }
    });
    return this.http.post<ResModel<any>>(`${environment.api}User/AddAgent`, formData);
  }

  update(agent: any, agentId: number) {
    const formData = new FormData();
    formData.append('AgentId', agentId.toString());
    Object.keys(agent).forEach(key => {
      if (agent[key]) {
        formData.append(key, agent[key])
      }
    });
    return this.http.put<ResModel<any>>(`${environment.api}User/UpdateAgent`, formData);
  }

  agents(_params: {
    builderId:number,
    agencyId:number
,    page?: number, size?: number,
    FilterBy?: string, FilterValue?: string,
    IsAsc?: boolean,
    OrderBy?: string
  }) {
    const params = new HttpParams({ fromObject: _params });
    return this.http.get<ResModel<Array<any>>>(`${environment.api}User/GetAgents`, { params });
  }

  agent(AgentId: number) {
    const params = new HttpParams({ fromObject: { AgentId } });
    return this.http.get<ResModel<any>>(`${environment.api}User/GetAgentDetail`, { params });
  }

  delete(AgentId: number,AgencyId:number,BuilderId:number) {
    const params = new HttpParams({ fromObject: { AgentId ,BuilderId,AgencyId} });
    return this.http.delete<ResModel<any>>(`${environment.api}User/DeleteAgent`, { params });
  }
}
