import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UnitDetailModalComponent } from 'src/app/modules/builder-admin-project/components/unit-detail-modal/unit-detail-modal.component';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { ProjectModel, ProjectRes, ProjectTower } from 'src/app/modules/sales-grid/components/sales-grid/project-res.model';

@Component({
  selector: 'app-agent-admin-worksheet-modal',
  templateUrl: './agent-admin-worksheet-modal.component.html',
  styleUrls: ['./agent-admin-worksheet-modal.component.scss']
})
export class AgentAdminWorksheetModalComponent implements OnInit {

  isProgressing: boolean = true;
  project!: ProjectModel;
  indicators!: Array<{ bgColor: string, title: string, value: string, }>
  stacks!: Array<string>;
  tower!: ProjectTower;
  amenties!: Array<{
    imagePath: string
    text: string
    value: number
  }>;
  flatNo: number = 0;
  flatId: number = 0;
  isSelected = false;

  projectId = 0;
  // folder!: Folder | null;
  // folderFile!: FolderFile;
  // folders: Array<Folder> = [];
  // user: User = CONSTANT.getUser();

  constructor(public dialogRef: MatDialogRef<AgentAdminWorksheetModalComponent>, @Inject(MAT_DIALOG_DATA) public worksheet: any,
    private projectsService: ProjectsService, public dialog: MatDialog) {
    console.log(worksheet)
    if (worksheet != null) {
      this.projectId = worksheet.projectId;
    }
  }

  ngOnInit(): void {
    this.projectsService.getProjectDetailBYProjectId(this.projectId).subscribe(projectRes => {
      if (!projectRes?.isSuccess) {
        this.isProgressing = false;
        //this.snackbarWrapperService.open(projectRes?.message || 'something went wrong ! Please try again');
      }
      if (projectRes?.isSuccess) {
        this.init(projectRes);
      }
    }, err => {
      // if (err?.error?.error) {
      //   this.snackbarWrapperService.open(JSON.stringify(err?.error?.error));
      // } else if (err.message || err?.data?.message) {
      //   this.snackbarWrapperService.open(JSON.stringify(err.message || err?.data?.message));
      // } else {
      //   this.snackbarWrapperService.open(JSON.stringify(err));
      // }
      this.isProgressing = false;
    });
  }

  init(res: any) {

    const projectRes: ProjectRes = res;
    // const projectRes: ProjectRes = PD;
    this.project = projectRes?.data;
    if (projectRes?.data?.projectGridColors?.length) {
      this.indicators = projectRes?.data?.projectGridColors.map(c => ({
        bgColor: c?.colorCode,
        title: c?.colorTitle,
        value: c?.colorCodeStatus ?? c?.colorCode,
      }))
    }
    if (this.project.projectTower?.length) {
      this.project.projectTower?.forEach(tower => {
        tower?.projectBlocks?.sort((a, b) => { return b.blockNo - a.blockNo });
        tower?.projectBlocks?.forEach(block => {
          block['count'] = `${block?.projectFloorDetails?.length} X ${block?.numberUnitsPerFloor} units | ${block?.projectFloorDetails?.length * block?.numberUnitsPerFloor} units`;
          block?.projectFloorDetails?.sort((a, b) => { return b.floorNo - a.floorNo });
          block?.projectFloorDetails?.forEach(floor => {
            floor?.projectUnitFlats?.sort((a, b) => { return a.flatNo - b.flatNo });
            floor?.projectUnitFlats?.forEach((flat, index, object) => {
              if (flat.assignAgentId != 0) {
                object.splice(index, 1);
              } else {
                const indicator = this.indicators?.find(i => i?.title?.toLowerCase() === flat?.flatStatus?.toLowerCase());
                flat['selected'] = false;
                flat['floorId'] = floor.floorId;
                flat['floorNo'] = floor.floorNo;
                flat['visibilityHidden'] = false;
                flat['bgColor'] = indicator?.bgColor || (this.indicators.length ? this.indicators[0].bgColor : '')
              }
            })
            // console.log(floor);
          })
        })
      })
      this.tower = this.project.projectTower[0];
      this.isProgressing = false;
      //this.configStacks();
    }

    if (this.amenties?.length && this.project?.amenities?.length) {
      this.amenties = this.amenties.filter(i => this.project?.amenities.find(_i => _i.amenityValue == i.value));
    }

    if (this.project?.projectMarketingAssets?.length) {
      const groups = this.project?.projectMarketingAssets?.reduce((accumulator, currentValue) => {
        accumulator[currentValue.folderName] = [...accumulator[currentValue.folderName] || [], currentValue];
        return accumulator;
      }, {});
      // this.folders = Object.keys(groups).map(folderName => ({
      //   name: folderName,
      //   files: groups[folderName].map(fileItem => {
      //     let type!: 'pdf' | 'img' | 'doc' | 'video';
      //     const file: File = fileItem.assetsFile;
      //     if (file?.type) {
      //       if (file.type.toLowerCase().startsWith("image")) {
      //         type = 'img';
      //       } else if (file.type.toLowerCase().startsWith("video")) {
      //         type = 'video';
      //       } else if (file.name.toLowerCase().endsWith('.pdf')) {
      //         type = 'pdf';
      //       } else if (file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx')) {
      //         type = 'doc';
      //       }
      //     }
      //     return { file, type, folderName, name: file?.name, id: fileItem.projectAssestsId, projectId: fileItem.projectId }
      //   }),
      //   selected: false
      // }));
    }


    //this.isProgressing = false;
  }

  onSelectTower(tower: ProjectTower) {
    if (tower?.towerId == this.tower?.towerId) { return }
    this.tower = tower;
    //this.configStacks();
  }

  selectUnit() {
    this.dialogRef.close({ flatNo: this.flatNo, flatId: this.flatId });
  }

  fetchUnit(flatId, flatNo) {
    this.flatNo = flatNo;
    this.dialogRef.close({ flatId: flatId, flatNo: flatNo });
  }

  openDialog(unitDetail: any) {
    this.flatNo = unitDetail.flatNo;
    this.flatId = unitDetail.flatId;

    this.project.projectTower?.forEach(tower => {
      tower?.projectBlocks?.forEach(block => {
        block?.projectFloorDetails?.forEach(floor => {
          floor?.projectUnitFlats?.forEach((flat, index, object) => {
            if (flat.assignAgentId != 0) {
              object.splice(index, 1);
            } else {
              flat['selected'] = false;
            }
          })
        })
      })
    })

    unitDetail.selected = !unitDetail.selected;
    // const dialogRef = 
    const dialogRef = this.dialog.open(UnitDetailModalComponent, {
      width: '90vw',
      maxWidth: '99vw',
      disableClose: true,
      data: unitDetail
    });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(result);
    //   // if (result != true) {
    //   //   this.flatNo = result.flatNo;
    //   //   this.flatId = result.flatId;
    //   // }
    // });
  }


}
