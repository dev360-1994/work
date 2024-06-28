import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResModel } from 'src/app/models/res.model';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) {

  }

  upload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<{ url: string }>(`${environment.api}File/uploadFileBuilderLogo`, formData);
  }
  uploadFileProjectLogo(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<{ url: string }>(`${environment.api}File/uploadFileProjectLogo`, formData);
  }
  uploadFileProjectHeroImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<{ url: string }>(`${environment.api}File/uploadFileProjectHeroImage`, formData);
  }

  uploadAgentCsv(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<ResModel<any>>(`${environment.api}User/AddAgentByCsv`, formData);
  }

}
