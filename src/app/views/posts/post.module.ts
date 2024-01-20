import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { PostRoutingModule } from './post-routing.module';
import { PostsComponent } from './posts.component';
import { ViewPostComponent } from './view-post/edit-post.component';
import {
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  ProgressModule,
  ToastModule,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/@shared/shared.module';
@NgModule({
  declarations: [PostsComponent, ViewPostComponent],
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
