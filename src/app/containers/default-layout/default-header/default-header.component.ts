import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)
  currentUser: any;

  constructor(private classToggler: ClassToggleService, private authService: AuthenticationService, private router: Router) {
    super();
    this.authService.currentUser.subscribe(user => this.changeName(user));;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private changeName(user:any): void {
    this.currentUser = user;
  }
}
