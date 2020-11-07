import { Component, OnInit } from '@angular/core';
import {ServerService} from '../services/server-service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  name: string;
  verfugernr: string;

  constructor(private server: ServerService) { }

  ngOnInit() {
    this.server.request('GET', '/profile').subscribe((accounts: any) => {
      if (accounts) {
        this.name = accounts.name;
        this.verfugernr = accounts.verfugernr;
      }
    });
  }
}
