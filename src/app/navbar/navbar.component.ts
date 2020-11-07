import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  collapsed = true;
  mobile = false;
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    if (window.screen.width === 360) { // 768px portrait
      this.mobile = true;
    }
  }

  onLogout() {
    this.authService.logout();
  }



}
