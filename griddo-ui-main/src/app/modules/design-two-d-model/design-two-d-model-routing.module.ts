import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesignTwoDModelComponent } from './components/design-two-d-model/design-two-d-model.component';

const routes: Routes = [
  { path: '', component: DesignTwoDModelComponent }

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignTwoDModelRoutingModule { }
