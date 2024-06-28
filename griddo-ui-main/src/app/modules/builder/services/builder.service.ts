import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user.model';
import { Builder } from 'src/app/models/builder.model';
import { ResModel } from 'src/app/models/res.model';


@Injectable({
  providedIn: 'root'
})
export class BuilderService {

  constructor(private http: HttpClient) {

  }

  add(builder: any) {
    const formData = new FormData();
    Object.keys(builder).forEach(key => {
      if (builder[key]) {
        formData.append(key, builder[key])
      }
    });
    return this.http.post<ResModel<Builder>>(`${environment.api}User/AddBuilder`, formData);
  }

  update(builder: any, builderId: number) {
    const formData = new FormData();
    formData.append('BuilderId', builderId.toString());
    Object.keys(builder).forEach(key => {
      if (builder[key]) {
        formData.append(key, builder[key])
      }
    });
    return this.http.put<ResModel<Builder>>(`${environment.api}User/UpdateBuilder`, formData);
  }

  builders(_params: {
    page?: number, size?: number,
    FilterBy?: string, FilterValue?: string,
    IsAsc?: boolean,
    OrderBy?: string
  }) {
    const params = new HttpParams({ fromObject: _params });
    return this.http.get<ResModel<Array<any>>>(`${environment.api}User/GetAllBuilders`, { params });
  }

  builder(BuilderId: number) {
    const params = new HttpParams({ fromObject: { BuilderId } });
    return this.http.get<ResModel<any>>(`${environment.api}User/GetBuilderDetail`, { params });
  }

  remove(BuilderId: number) {
    const params = new HttpParams({ fromObject: { BuilderId } });
    return this.http.delete<ResModel<any>>(`${environment.api}User/DeleteBuilder`, { params });
  }

  search(searchText: string) {
    return this.http.post<ResModel<any>>(`${environment.api}User/SearchBuilder`, { searchText });
  }
}
