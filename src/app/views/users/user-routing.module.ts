import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { ViewUserPostComponent } from './view-post-list/post-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    data: {
      title: 'User Page',
    },
  },
  {
    path: ':id',
    component: ViewUserPostComponent,
    data: {
      title: 'User Posts',
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }
