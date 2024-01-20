import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunityComponent } from '../community/community.component';
import { PostsComponent } from './posts.component';
import { ViewPostComponent } from './view-post/edit-post.component';

const routes: Routes = [
  {
    path: '',
    component: PostsComponent,
    data: {
      title: 'Post Page',
    },
  },
  {
    path: ':id',
    component: ViewPostComponent,
    data: {
      title: 'Post Deatil Page',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostRoutingModule {}
