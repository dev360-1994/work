import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBuilderComponent } from './components/add-builder/add-builder.component';
import { BuilderComponent } from './components/builder/builder.component';
import { BuildersComponent } from './components/builders/builders.component';

const routes: Routes = [
  { path: '', component: BuildersComponent },
  { path: 'add', component: AddBuilderComponent },
  { path: 'add/:builderId', component: AddBuilderComponent },
  { path: ':builderId', component: BuilderComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuilderRoutingModule { }
