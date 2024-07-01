import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import {
  HashLocationStrategy,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { NgScrollbarModule } from 'ngx-scrollbar';

// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import app component
import { AppComponent } from './app.component';
import { IconSetService } from '@coreui/icons-angular';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginModule } from './views/login/login.module';
import { FooterComponent } from './containers/default-layout/footer/footer.component';
import { HeaderComponent } from './containers/default-layout/header/header.component';
import { LayoutComponent } from './containers/default-layout/layout.component';
import { SharedModule } from './@shared/shared.module';
import { AuthInterceptor } from './@shared/intersaptor/auth.interceptor';
import { AuthenticationGuard } from './@shared/guards/authentication.guard';

// const APP_CONTAINERS = [

// ];

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgScrollbarModule,
    HttpClientModule,
    FormsModule,
    LoginModule,
    SharedModule,
  ],
  providers: [
    // {
    //   provide: LocationStrategy,
    //   useClass: HashLocationStrategy
    // },
    AuthenticationGuard,
    IconSetService,
    Title,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
