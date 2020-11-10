import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  collapsed = true;
  mobile = false;
  constructor(public authService: AuthService, public breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver.observe('(max-width: 990px)').subscribe(result => {
      this.mobile = result.matches;
    });
  }
  // TODO: How to close toggle-menu on click outside of nav. Setting collapsed = true doesn't help.
  onClickedOutside(e: Event) {
    if (!this.collapsed) {
      console.log('Clicked outside:', e);
      this.collapsed = true;
    }
  }

  async onLogout() {
    await this.authService.logout();
  }



}
