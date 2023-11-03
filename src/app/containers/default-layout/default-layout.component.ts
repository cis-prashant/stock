import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services';
import { navItems, navItems1 } from './_nav';
import { INavData } from '@coreui/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent {

  // public navItems = navItems;
  public navItems: INavData[] = [];
  public navItems1 = navItems1;
  currentUser: any;

  constructor(private authService: AuthenticationService) {
    this.authService.currentUser.subscribe(user => this.changeName(user));
  }

  private changeName(user:any): void {
    this.currentUser = user;
  }

  ngOnInit() {
    for (let index = 0; index < navItems.length; index++) {
      if (this.currentUser.role_id == 1 || this.currentUser.role_id == 2) {
        this.navItems.push(navItems[index]);
      } else if (this.currentUser.role_id == 3 && this.currentUser.access.includes(navItems[index].name)) {
        this.navItems.push(navItems[index]);
      }
    }
  }
}
