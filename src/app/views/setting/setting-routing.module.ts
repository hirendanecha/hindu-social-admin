import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingComponent } from './setting.component';
import { ViewReportComponent } from './view-report/view-report.component';

const routes: Routes = [
  {
    path: '',
    component: SettingComponent,
    data: {
      title: 'Support Ticket Page',
    },
  },
  {
    path: 'ticket/:id',
    component: ViewReportComponent,
    data: {
      title: 'View Ticket Details',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingRoutingModule { }
