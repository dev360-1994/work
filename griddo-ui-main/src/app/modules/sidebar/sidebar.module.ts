import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LogoModule } from '../logo/logo.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [
    SidebarComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    LogoModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatAutocompleteModule

  ],
  exports: [SidebarComponent]
})
export class SidebarModule { }
