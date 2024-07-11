import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from '@angular/core';

import { SharedModule } from '../../@shared/shared.module';
import { AdvertisementRoutingModule } from './advertisement-routing.module';
import { AdvertisementComponent } from './advertisement.component';

@NgModule({
  declarations: [AdvertisementComponent],
  imports: [SharedModule, AdvertisementRoutingModule],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AdvertisementModule { }
