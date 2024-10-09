import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { PostRoutingModule } from './post-routing.module';
import { PostsComponent } from './posts.component';
import { ViewPostComponent } from './view-post/edit-post.component';
import { RePostCardComponent } from './re-post-card/re-post-card.component';
import { PostMetaDataCardComponent } from './post-meta-data-card/post-meta-data-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/@shared/shared.module';
import { DateDayPipe } from 'src/app/views/posts/date-day.pipe';
@NgModule({
  declarations: [PostsComponent, ViewPostComponent, DateDayPipe, RePostCardComponent, PostMetaDataCardComponent],
  imports: [
    CommonModule,
    PostRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PostModule {}
