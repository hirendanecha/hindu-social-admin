import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResearchTopicsComponent } from './research-topics.component';
import { EditResearchTopicsComponent } from 'src/app/@shared/components/edit-research-topics/edit-research-topics.component';

const routes: Routes = [
  {
    path: '',
    component: ResearchTopicsComponent,
    data: {
      title: 'Research Topics Page',
    },
  },
  {
    path: 'edit/:id',
    component: EditResearchTopicsComponent,
    data: {
      title: 'Edit Topics',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResearchTopicsRoutingModule {}
