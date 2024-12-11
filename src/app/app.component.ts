import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';
import { TokenStorageService } from './services/token-storage.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet><app-toaster />',
})
export class AppComponent implements OnInit {
  title = 'Hindu Social Admin';

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,
    private tokenStorageService: TokenStorageService
  ) {
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      } else if (!this.tokenStorageService.getToken()) {
        this.router.navigateByUrl('/login');
        return;
      }
    });
  }
}
