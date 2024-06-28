import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ProjectsService, } from '../../services/projects.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ConfirmModalComponent } from 'src/app/common/components/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.scss']
})
export class ViewProjectComponent implements OnInit {
  isProcessing: boolean = false;
  fileTemplate: any;
  dealId: any;

  constructor(private projectService: ProjectsService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer, private router: Router, public activatedRoute: ActivatedRoute) {

  }

  public showDocuSign: boolean = false;
  public reqFromWorksheet: boolean = false;
  documentUrl: SafeResourceUrl = "";
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params["docuUrl"]);
      this.dealId = +params["dealId"]
      if (params["docuUrl"])
        this.showDocuSign = true;
      this.reqFromWorksheet = true;
      this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(params["docuUrl"]
      );
    });
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.fileTemplate = event.target.files[0];

    }
  }
  createEnvelop() {
    this.isProcessing = true;
    if (!this.fileTemplate)
      return;
    const formData = new FormData();
    formData.append("file", this.fileTemplate)
    this.projectService.CreateEnvelop(formData).subscribe(x => {
      this.isProcessing = false;
      if (x.isSuccess) {
        this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(x.data?.item2);
        this.showDocuSign = true;
      }
    }, error => {
      console.log("server error");
    },

    )
  }
  closeConnection() {
    this.showDocuSign = false;
    if (!this.reqFromWorksheet)
      this.router.navigate(['/griddo-master/projects']);
    else
      this.router.navigate(['/builder-admin/worksheets']);

  }

  redirectToDeal() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        worksheetId: this.dealId
      }
    };
    this.router.navigate(['builder-admin/deals/deal/' + this.dealId]);
  }

  confirmDialog() {

    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '90vw',
      maxWidth: '55vw',
      disableClose: true,
      data: { heading: "Back To Deal", content: "You will loss docusign changes, are you sure you want to go back to deal?" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.redirectToDeal();
      }
    });
  }
}
