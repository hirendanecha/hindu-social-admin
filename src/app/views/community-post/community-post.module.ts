import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommunityPostComponent } from './community-posts.component';
import { CommunityPostRoutingModule } from './community-post-routing.module';
import { SharedModule } from 'src/app/@shared/shared.module';
import { ViewCommunityPostComponent } from '../community-post/view-post/edit-post.component';
@NgModule({
  declarations: [CommunityPostComponent, ViewCommunityPostComponent],
  imports: [SharedModule, CommunityPostRoutingModule],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CommunityPostModule {}
