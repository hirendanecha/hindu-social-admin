import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivate } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { LayoutComponent } from './containers/default-layout/layout.component';
import { AuthenticationGuard } from './@shared/guards/authentication.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    data: {
      title: 'Home',
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
          canActivate: mapToCanActivate([AuthenticationGuard])
      },
      {
        path: 'post-list',
        loadChildren: () =>
          import('./views/posts/post.module').then((m) => m.PostModule),
          canActivate: mapToCanActivate([AuthenticationGuard])
      },
      // {
      //   path: 'community-post',
      //   loadChildren: () =>
      //     import('./views/community-post/community-post.module').then((m) => m.CommunityPostModule),
      // },
      {
        path: 'community',
        loadChildren: () =>
          import('./views/community/community.module').then(
            (m) => m.CommunityModule
          ),
          canActivate: mapToCanActivate([AuthenticationGuard])
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./views/users/user.module').then((m) => m.UserModule),
          canActivate: mapToCanActivate([AuthenticationGuard])
      },
      {
        path: 'marketing',
        loadChildren: () =>
          import('./views/marketing-page/marketing.module').then((m) => m.MarketingModule),
          canActivate: mapToCanActivate([AuthenticationGuard])
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/freedom-page/freedom-page.module').then((m) => m.FreedomPageModule),
          canActivate: mapToCanActivate([AuthenticationGuard])
      },
      {
        path: 'channels',
        loadChildren: () =>
          import('./views/channels/channels.module').then((m) => m.ChannelsModule),
          canActivate: mapToCanActivate([AuthenticationGuard])
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page',
    },
  },
  // {
  //   path: 'register',
  //   component: RegisterComponent,
  //   data: {
  //     title: 'Register Page',
  //   },
  // },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking',
      // relativeLinkResolution: 'legacy'
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
