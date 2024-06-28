import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { ProjectModel, ProjectRes, ProjectTower } from 'src/app/modules/sales-grid/components/sales-grid/project-res.model';

@Component({
    selector: 'app-unit-detail-modal',
    templateUrl: './unit-detail-modal.component.html',
    styleUrls: ['./unit-detail-modal.component.scss']
})
export class UnitDetailModalComponent implements OnInit {

    isProgressing: boolean = true;
    tower!: ProjectTower;
    flatNo: number = 0;
    flatDetail: any;

    constructor(public dialogRef: MatDialogRef<UnitDetailModalComponent>, @Inject(MAT_DIALOG_DATA) public unitDetail: any) {
        //console.log(unitDetail)
        if (unitDetail != null) {
            this.flatDetail = unitDetail;
        }
    }

    ngOnInit(): void {

    }

    init(res: any) {

    }

    onSelectTower(tower: ProjectTower) {
        if (tower?.towerId == this.tower?.towerId) { return }
        this.tower = tower;
        //this.configStacks();
    }

    selectUnit() {
        this.dialogRef.close(this.flatNo);
    }

    fetchUnit(flatId, flatNo) {
        this.flatNo = flatNo;
        this.dialogRef.close({ flatId: flatId, flatNo: flatNo });
    }


}
