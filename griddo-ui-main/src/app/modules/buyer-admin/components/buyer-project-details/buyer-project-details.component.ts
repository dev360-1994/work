import { SecurityContext } from '@angular/compiler/src/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CONSTANT } from 'src/app/constants';
import { User } from 'src/app/models/user.model';
import { SearchBarService } from 'src/app/modules/sidebar/search-bar.service';
import { BuyerAdminService } from '../../services/buyer-admin.service';
import { DocumentModalComponent } from '../document-modal/document-modal.component';

@Component({
  selector: 'app-buyer-project-details',
  templateUrl: './buyer-project-details.component.html',
  styleUrls: ['./buyer-project-details.component.scss']
})
export class BuyerProjectDetailsComponent implements OnInit,OnDestroy {
  projectId!: any;
  subscription!: Subscription
  user: User = CONSTANT.getUser();
  project: any;
  filteredItems: Array<any> = [];
  isProcessing!: boolean;
  worksheetDocuments: any;
  buyerDocuments: any;
  isValidDate = false;

  constructor(private activatedRoute: ActivatedRoute,
    private buyerAdminService: BuyerAdminService,
    private searchBarService: SearchBarService,
    public dialog: MatDialog, private router: Router) {
    this.subscription = this.activatedRoute.params.subscribe(params => {
      this.projectId = params.projectId;
      this.getProjectDetail();
    });
    this.enableSearchBar();
  }

  enableSearchBar(enabled = true) {
    this.searchBarService.toggleSearchBar.emit({
      enabled,
      filterBy: '',
      placeholder: 'Search My Documents...',
      onSearch: (val: string) => {
        this.filterItem(val)
      },
    });
  }

  getProjectDetail() {
    this.isProcessing = true;
    this.buyerAdminService.getBuyerProjectDetail(this.user.userName || this.user.email, this.projectId).subscribe(project => {

      if (project?.project?.completionDate) this.isValidDate = new Date(project?.project?.completionDate).getFullYear() > 1900 ? true : false;

      this.isProcessing = false;
      this.project = project;
      this.worksheetDocuments = project?.projectWorksheetDocument;
      this.buyerDocuments = project?.buyerWorksheetDocument;
      this.project.flatPrice = this.getPriceTotal(project);

      if (this.project?.projectUnitFlats?.flatprojectUnitAdditionalFeatures?.length) {
        this.project.projectUnitFlats['flatprojectUnitAdditionalFeature'] = this.project?.projectUnitFlats?.flatprojectUnitAdditionalFeatures
          ?.filter(i => i?.isEligible || i?.isIncluded)?.map(i => i?.name)?.join(', ');
      };
      // this.filterItem(null);
    }, err => {
      this.isProcessing = false;
    });
  }

  filterItem(value) {
    if (!value) {
      this.worksheetDocuments = this.project?.projectWorksheetDocument;
      this.buyerDocuments = this.project?.buyerWorksheetDocument;
    }
    else {
      this.worksheetDocuments = this.project?.projectWorksheetDocument.filter(
        item => item?.worksheetNumber?.toString()?.toLowerCase()?.includes(value.toLowerCase())
      );

      this.buyerDocuments = this.project?.buyerWorksheetDocument.filter(
        item => item?.documentFileName?.toString()?.toLowerCase()?.includes(value.toLowerCase())
      );

    }
  }

  ngOnInit(): void {
  }

  openDialog() {
    // const dialogRef = 
    const dialogRef = this.dialog.open(DocumentModalComponent, {
      width: '90vw',
      maxWidth: '40vw',
      disableClose: true,
      data: this.projectId
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.isSaved == true)
        this.getProjectDetail();
    });
  }


  printDocument(documentPath: string) {
    //window.print();
    let iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = '';
    iframe.src = 'https://griddo-dev.s3.ca-central-1.amazonaws.com/Project/WorksheetDepositDocument/637805609889829696APS Sample.pdf';
    document.body.appendChild(iframe);
    iframe?.contentWindow?.print();
  }

  gotoDocusign(docusignPath: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "docuUrl": docusignPath
      }
    };
    this.router.navigate(['buyer-admin/docuSignUpload'], navigationExtras);
  }

  getPriceTotal(data: any) {
    let amount = 0;
    amount = data?.projectUnitFlats?.price + data?.projectUnitFlats?.floorPremium ?? 0;
    let taxTotal = data.project.projectTax.reduce((accum, item) => accum + parseInt(item.value), 0)
    if (taxTotal > 0) {
      amount += parseInt(((amount / 100) * taxTotal).toFixed());
    }
    return amount;
  }

  public ngOnDestroy(): void {
    this.enableSearchBar(false);
    this.subscription?.unsubscribe();
  }
}
