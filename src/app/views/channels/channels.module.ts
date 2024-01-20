import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../@shared/shared.module';
import { ChannelsRoutingModule } from './channels-routing.module';
import { ChannelsComponent } from './channels.component';
import { EditChannelComponent } from 'src/app/@shared/components/edit-channel/edit-channel.component';


@NgModule({
  declarations: [
    ChannelsComponent,
    EditChannelComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ChannelsRoutingModule
  ],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChannelsModule { }
