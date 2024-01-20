import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunityPostComponent } from './community-posts.component';
import { ViewCommunityPostComponent } from './view-post/edit-post.component';

const routes: Routes = [
  {
    path: '',
    component: CommunityPostComponent,
    data: {
      title: 'Community Post Page',
    },
  },
  {
    path: ':id',
    component: ViewCommunityPostComponent,
    data: {
      title: 'Community Post Deatil Page',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityPostRoutingModule {}
