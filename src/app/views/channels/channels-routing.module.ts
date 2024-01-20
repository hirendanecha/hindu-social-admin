import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChannelsComponent } from './channels.component';
import { EditChannelComponent } from 'src/app/@shared/components/edit-channel/edit-channel.component';

const routes: Routes = [
  {
    
    path: '',
    component: ChannelsComponent,
    data: {
      title: 'Channel Page',
    },
  }, {
    path: 'edit/:id',
    component: EditChannelComponent,
    data: {
      title: 'Edit Channel',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChannelsRoutingModule { }
