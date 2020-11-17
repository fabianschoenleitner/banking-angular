import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth-service';
import {BreakpointObserver} from '@angular/cdk/layout';

@Component({
  selector: 'app-sub-navbar',
  templateUrl: './sub-navbar.component.html',
  styleUrls: ['./sub-navbar.component.scss']
})
export class SubNavbarComponent implements OnInit {
  collapsed = true;
  mobile = false;

  constructor(public authService: AuthService, public breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this.breakpointObserver.observe('(max-width: 990px)').subscribe(result => {
      this.mobile = result.matches;
    });
  }

  // TODO: How to close toggle-menu on click outside of nav. Setting collapsed = true doesn't help.
  onClickedOutside(e: Event): void {
    if (!this.collapsed) {
      console.log('Clicked outside:', e);
      this.collapsed = true;
    }
  }

  async onLogout(): Promise<void> {
    await this.authService.logout();
  }


}
