import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ResearchTopicsComponent } from './research-topics.component';
import { CreateResearchTopicComponent } from './create-research-topic/create-research-topic.component';
import { ResearchTopicsRoutingModule } from './research-topics-routing.module';
import { SharedModule } from '../../@shared/shared.module';
import { EditResearchTopicsComponent } from 'src/app/@shared/components/edit-research-topics/edit-research-topics.component';
@NgModule({
  declarations: [
    ResearchTopicsComponent,
    EditResearchTopicsComponent,
    CreateResearchTopicComponent,
  ],
  imports: [SharedModule, ResearchTopicsRoutingModule],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ResearchTopicsModule {}
