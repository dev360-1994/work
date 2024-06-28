import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentsRoutingModule } from './agents-routing.module';
import { AgentsComponent } from './components/agents/agents.component';
import { AddAgentComponent } from './components/add-agent/add-agent.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AgentComponent } from './components/agent/agent.component';
import { AgentCardComponent } from './components/agent-card/agent-card.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { MatListModule } from '@angular/material/list';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FileDragNDropModule } from '../../directives/file-drag-n-drop/file-drag-n-drop.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
  declarations: [
    AgentsComponent,
    AddAgentComponent,
    AgentComponent,
    AgentCardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    AgentsRoutingModule,
    GooglePlaceModule,
    PopoverModule,
    MatListModule,
    MatSnackBarModule,
    ImageCropperModule,
    MatDialogModule,
    FileDragNDropModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatPaginatorModule,
    NgxIntlTelInputModule
  ]
})
export class AgentsModule { }
