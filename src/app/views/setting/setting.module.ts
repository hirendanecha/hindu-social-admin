import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from '@angular/core';

import { SharedModule } from '../../@shared/shared.module';
import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting.component';
import { ViewReportComponent } from './view-report/view-report.component';

@NgModule({
  declarations: [SettingComponent, ViewReportComponent],
  imports: [SharedModule, SettingRoutingModule],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SettingModule { }
