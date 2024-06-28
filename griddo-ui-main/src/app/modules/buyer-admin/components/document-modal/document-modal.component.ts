import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { CONSTANT } from 'src/app/constants';
import { UnitDetailModalComponent } from 'src/app/modules/builder-admin-project/components/unit-detail-modal/unit-detail-modal.component';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { ProjectModel, ProjectRes, ProjectTower } from 'src/app/modules/sales-grid/components/sales-grid/project-res.model';
import { BuyerAdminService } from '../../services/buyer-admin.service';

@Component({
    selector: 'app-document-modal',
    templateUrl: './document-modal.component.html',
    styleUrls: ['./document-modal.component.scss']
})
export class DocumentModalComponent implements OnInit {

    isProgressing: boolean = false;
    documentName = '';
    documentFile: any;
    user = CONSTANT.getUser();
    projectId = 0;

    constructor(public dialogRef: MatDialogRef<DocumentModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
        private buyerAdminService: BuyerAdminService, public dialog: MatDialog,
        private snackbarWrapperService: SnackbarWrapperService) {
        console.log(data)
        if (data != null) {
            this.projectId = data;
        }
    }

    ngOnInit(): void {

    }



    saveDocument() {

        const payload = {
            buyersDocument: {
                documentFile: this.documentFile,
                documentFileName: this.documentName,
                buyerEmailId: this.user.email,
                projectId: this.projectId
            }
        }

        const formData = new FormData();
        Object.keys(payload).forEach(key => {
            if (payload[key]) {
                Object.keys(payload[key]).forEach(key1 => {
                    if (typeof payload[key][key1] === "object" && (payload[key] instanceof File)) {
                        if (payload[key].length > 0) {
                            payload[key].forEach(function (value: any, index: number) {
                                if (value?.email != "" || value?.item != "") {
                                    for (var key2 in payload[key][index]) {
                                        if (typeof payload[key][index][key2] === "object" && (payload[key][index][key2] instanceof File)) {
                                            formData.append(key2 + `[${index}]`, value[key2]);
                                        }
                                        else {
                                            formData.append(key + `[${index}][${key2}]`, value[key2])
                                        }
                                    }
                                }
                            });
                        }
                        else {
                            formData.append(key+ `[${key1}]`, payload[key][key1])
                        }
                    }
                    else {
                        formData.append(key+ `[${key1}]`, payload[key][key1])
                    }
                });
            }
        });
        this.isProgressing = true;
        this.buyerAdminService.uploadDocument(formData).subscribe(res => {
            this.isProgressing= false;
            this.snackbarWrapperService.open("Document uploaded successfully.");
            this.dialogRef.close({isSaved : true});
        }, err => {
            this.snackbarWrapperService.open(err);
        });
    }

    onFileChange(event: any) {
        const file = event.target.files[0];
        if (file != undefined) {
            this.documentName = file.name;
            this.documentFile = file;
        }
    }

    fileChangeEvent(event: any) {
        const file = event.target.files[0];
        if (file != undefined) {
            this.documentName = file.name;
            console.log(file);
            this.documentFile = file;
        }
    }

}
