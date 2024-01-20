import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ClassToggleService } from '@coreui/angular';

// import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Input() sidebarId: string = 'sidebar';

  public newMessages = new Array(4);
  public newTasks = new Array(5);
  public newNotifications = new Array(5);

  constructor(
    private classToggler: ClassToggleService,
    private tokenStorageService: TokenStorageService,
    private router: Router 
  ) {
  }

  logout(): void {
// this.isCollapsed = true;
    this.tokenStorageService.signOut();
    this.router.navigate(['/login']);
    // this.sellService.cartData$.next(null);
    // this.isDomain = false;
  }
}
