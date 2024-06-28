import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { MatListModule } from '@angular/material/list';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatDialogModule } from '@angular/material/dialog';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { MatStepperModule } from '@angular/material/stepper';
import { StepperComponent } from './components/stepper/stepper.component';
import { DepositComponent } from './components/deposit/deposit.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BuildGridComponent } from './components/build-grid/build-grid.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LevelDetailComponent } from './components/level-detail/level-detail.component';
import { WorksheetBuyerRulesComponent } from './components/worksheet-buyer-rules/worksheet-buyer-rules.component';
import { SalesTeamComponent } from './components/sales-team/sales-team.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FileDragNDropModule } from '../../directives/file-drag-n-drop/file-drag-n-drop.module';
import { DocumentTemplateComponent } from './components/document-template/document-template.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { MarketingAssetsComponent } from './components/marketing-assets/marketing-assets.component';
import { ExternalSalesTeamComponent } from './components/sales-team/external-sales-team/external-sales-team.component';
import { ListingAgencyComponent } from './components/sales-team/listing-agency/listing-agency.component';
import { ExternalBrokersComponent } from './components/external-brokers/external-brokers.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ColorPickerModule } from 'ngx-color-picker';
import { UnitPricingDetailComponent } from './components/build-grid/unit-pricing-detail/unit-pricing-detail.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { UnitNumbersComponent } from './components/build-grid/unit-numbers/unit-numbers.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ViewProjectComponent } from './components/view-project/view-project.component';
import { CommissionsComponent } from './components/commissions/commissions.component';
import { SearchPipeModule } from '../../pipes/search-pipe/search-pipe.module';
import { OrderByPipe } from './directives/order_by_pipe';
import { RouterModule } from '@angular/router';
import { ProgressModalComponent } from 'src/app/common/components/progress-modal/progress-modal.component';

const COMPONENTS = [ProjectListComponent,
    AddProjectComponent,
    OnlyNumberDirective, StepperComponent, DepositComponent, BuildGridComponent, LevelDetailComponent, WorksheetBuyerRulesComponent, SalesTeamComponent,
    ProjectCardComponent, DocumentTemplateComponent, MarketingAssetsComponent, ExternalSalesTeamComponent, ListingAgencyComponent, ExternalBrokersComponent, UnitPricingDetailComponent, UnitNumbersComponent
    , ViewProjectComponent, CommissionsComponent, OrderByPipe, ProgressModalComponent]

@NgModule({
    declarations: COMPONENTS,
    imports: [
        CommonModule,
        NgxIntlTelInputModule,
        RouterModule,
        NgxMaterialTimepickerModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        ReactiveFormsModule,
        FormsModule,
        PopoverModule,
        MatListModule,
        ImageCropperModule,
        MatDialogModule,
        MatRadioModule,
        MatInputModule,
        GooglePlaceModule,
        MatStepperModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        PdfViewerModule,
        MatSlideToggleModule
        , MatPaginatorModule
        , MatProgressBarModule,
        FileDragNDropModule, CKEditorModule, MatExpansionModule, ColorPickerModule, NgSelectModule,
        SearchPipeModule,
    ],
    exports: COMPONENTS
})
export class ProjectWithoutRoutesModule { }
