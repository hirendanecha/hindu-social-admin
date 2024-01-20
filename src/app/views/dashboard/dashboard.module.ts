import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NumberFormatPipe } from './number-format.pipe';
import { SharedModule } from 'src/app/@shared/shared.module';

@NgModule({
  imports: [
    DashboardRoutingModule,
    SharedModule
  ],
  declarations: [DashboardComponent, NumberFormatPipe],
})
export class DashboardModule { }
