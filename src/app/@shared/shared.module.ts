import { NgModule } from '@angular/core';
import { PaginationComponent } from './components/pagination/pagination.component';
import { TableComponent } from './components/table/table.component';
import { CommonModule, NgSwitch } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AvatarModule,
  CardModule,
  ButtonModule,
  GridModule,
  FormModule,
  TableModule,
  BadgeModule,
  PaginationModule,
  ModalModule,
  ToastModule,
  ProgressModule,
  NavModule,
  TabsModule,
  BreadcrumbModule,
  FooterModule,
  DropdownModule,
  HeaderModule,
  SidebarModule,
  UtilitiesModule,
  ButtonGroupModule,
  ListGroupModule,
  WidgetModule,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { DeleteDialogComponent } from '../views/users/delete-confirmation-dialog/delete-dialog.component';
import { ToastComponent } from '../views/toaster/toast.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FilterComponent } from './components/filter/filter.component';
import { EditCommunityComponent } from './components/edit-community/edit-community.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToasterComponent } from 'src/app/@shared/toaster/toaster.component'
import { ImgLayoutComponent } from './components/img-layout/img-layout.component'
import { CreateChannelComponent } from '../views/users/create-channel/create-channel.component';
const sharedComponents = [
  PaginationComponent,
  TableComponent,
  DeleteDialogComponent,
  ToastComponent,
  FilterComponent,
  EditCommunityComponent,
  ToasterComponent,
  CreateChannelComponent,
  ImgLayoutComponent
];

const sharedModules = [
  FormsModule,
  ReactiveFormsModule,
  CommonModule,
  IconModule,
  AvatarModule,
  CardModule,
  ButtonModule,
  GridModule,
  FormModule,
  TableModule,
  BadgeModule,
  PaginationModule,
  ModalModule,
  ToastModule,
  ProgressModule,
  NavModule,
  TabsModule,
  BreadcrumbModule,
  FooterModule,
  DropdownModule,
  HeaderModule,
  SidebarModule,
  IconModule,
  UtilitiesModule,
  ButtonGroupModule,
  ListGroupModule,
  NgxSpinnerModule,
  NgSelectModule,
  WidgetModule,
];

@NgModule({
  declarations: sharedComponents,
  imports: sharedModules,
  exports: [...sharedModules, ...sharedComponents],
})
export class SharedModule { }
