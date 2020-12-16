import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth-service';
import {BreakpointObserver} from '@angular/cdk/layout';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  collapsed = true;
  mobile = false;

  constructor(public authService: AuthService, public breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this.breakpointObserver.observe('(max-width: 990px)').subscribe(result => {
      this.mobile = result.matches;
    });
  }

  onClickedOutside(e: Event): void {
    if (!this.collapsed) {
      this.collapsed = true;
    }
  }

  async onLogout(): Promise<void> {
    await this.authService.logout();
  }
}
