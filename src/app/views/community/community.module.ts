import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { CommunityRoutingModule } from './community-routing.module';
import { CommunityComponent } from './community.component';
import { SharedModule } from 'src/app/@shared/shared.module';
@NgModule({
  declarations: [
    CommunityComponent
  ],
  imports: [
    SharedModule,
    CommunityRoutingModule,
  ],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CommunityModule { }
