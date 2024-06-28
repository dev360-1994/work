import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { ActivatedRoute } from '@angular/router';
import { checkNullValueAsStringAndReplaceWithNull, CONSTANT } from 'src/app/constants';
import { User } from 'src/app/models/user.model';
import { Folder, FolderFile } from 'src/app/modules/projects/components/marketing-assets/marketing-assets.component';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { ProjectModel, ProjectRes, ProjectTower } from 'src/app/modules/sales-grid/components/sales-grid/project-res.model';

@Component({
  selector: 'app-agency-admin-project',
  templateUrl: './agency-admin-project.component.html',
  styleUrls: ['./agency-admin-project.component.scss']
})
export class AgencyAdminProjectComponent implements OnInit {
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

  folder!: Folder | null;
  folderFile!: FolderFile;
  folders: Array<Folder> = [];
  user: User = CONSTANT.getUser();


  constructor(private activatedRoute: ActivatedRoute,
    private snackbarWrapperService: SnackbarWrapperService,
    public dialog: MatDialog,
    private projectsService: ProjectsService) {
    this.getAmenties();
  }

  ngOnInit(): void {
  }

  fetchProject() {
    const projectId = CONSTANT.find_params_in_activated_route('projectId', this.activatedRoute.snapshot);
    if (projectId) {
      this.isProgressing = true;
      this.projectsService.getProjectDetailBYProjectId(projectId).subscribe(projectRes => {
        if (!projectRes?.isSuccess) {
          this.isProgressing = false;
          this.snackbarWrapperService.open(projectRes?.message || 'something went wrong ! Please try again');
        }
        if (projectRes?.isSuccess) {
          this.init(projectRes);
        }
      }, err => {
        if (err?.error?.error) {
          this.snackbarWrapperService.open(JSON.stringify(err?.error?.error));
        } else if (err.message || err?.data?.message) {
          this.snackbarWrapperService.open(JSON.stringify(err.message || err?.data?.message));
        } else {
          this.snackbarWrapperService.open(JSON.stringify(err));
        }
        this.isProgressing = false;
      });
    } else {
      this.isProgressing = false;
    }
  }


  init(res: any) {

    const projectRes: ProjectRes = res;
    // const projectRes: ProjectRes = PD;
    this.project = checkNullValueAsStringAndReplaceWithNull(projectRes?.data || {});

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
            floor?.projectUnitFlats?.forEach(flat => {
              const indicator = this.indicators?.find(i => i?.title?.toLowerCase() === flat?.flatStatus?.toLowerCase());
              flat['selected'] = false;
              flat['floorId'] = floor.floorId;
              flat['floorNo'] = floor.floorNo;
              flat['visibilityHidden'] = false;
              flat['bgColor'] = indicator?.bgColor || (this.indicators.length ? this.indicators[0].bgColor : '')
            })
          })
        })
      })
      this.tower = this.project.projectTower[0];
      this.configStacks();
    }

    if (this.amenties?.length && this.project?.amenities?.length) {
      this.amenties = this.amenties.filter(i => this.project?.amenities.find(_i => _i.amenityValue == i.value));
    }

    if (this.project?.projectMarketingAssets?.length) {
      const groups = this.project?.projectMarketingAssets?.reduce((accumulator, currentValue) => {
        accumulator[currentValue.folderName] = [...accumulator[currentValue.folderName] || [], currentValue];
        return accumulator;
      }, {});
      this.folders = Object.keys(groups).map(folderName => ({
        name: folderName,
        files: groups[folderName].map(fileItem => {
          let type!: 'pdf' | 'img' | 'doc' | 'video';
          const file: File = fileItem.assetsFile;
          if (file?.type) {
            if (file.type.toLowerCase().startsWith("image")) {
              type = 'img';
            } else if (file.type.toLowerCase().startsWith("video")) {
              type = 'video';
            } else if (file.name.toLowerCase().endsWith('.pdf')) {
              type = 'pdf';
            } else if (file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx')) {
              type = 'doc';
            }
          }
          return { file, type, folderName, name: file?.name, id: fileItem.projectAssestsId, projectId: fileItem.projectId }
        }),
        selected: false
      }));
    }


    this.isProgressing = false;
  }

  allFolders() {
    this.folders.forEach(f => f.selected = false);
    this.folder = null;
  }

  selectFolder(folderIndex) {
    this.folders.forEach(f => f.selected = false);
    this.folders[folderIndex].selected = true;
    this.folder = this.folders[folderIndex];
  }

  configStacks() {
    const unitsLen: Array<number> = [];
    this.tower?.projectBlocks?.forEach(pb => pb?.projectFloorDetails?.forEach(f => unitsLen.push(f?.projectUnitFlats?.length || 0)));
    if (unitsLen?.length) {
      const maxNumber = Math.max(...unitsLen);
      this.stacks = Array.from(Array(maxNumber), (_, index) => {
        let n = index + 1;
        if (n < 10) {
          return `0${n}`
        }
        return `${n}`;
      });
    }
  }
  onSelectTower(tower: ProjectTower) {
    if (tower?.towerId == this.tower?.towerId) { return }
    this.tower = tower;
    this.configStacks();
  }

  getAmenties() {
    this.amenties = [];
    this.projectsService.getAmenties().subscribe(res => {
      if (res?.isSuccess) {
        this.amenties = res?.data || [];
      }
      this.fetchProject();
    }, err => this.fetchProject());
  }



  preview(previewTemplate: TemplateRef<any>, folderFile: FolderFile) {
    this.folderFile = folderFile;
    const dialogRef = this.dialog.open(previewTemplate, {
      width: '100vw',
      maxWidth: '100vw',
      disableClose: true
    });
  }

}
