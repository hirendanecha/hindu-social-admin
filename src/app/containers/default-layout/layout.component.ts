import { Component } from '@angular/core';

import { navItems } from './_nav';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  public navItems = navItems;

  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}
}
