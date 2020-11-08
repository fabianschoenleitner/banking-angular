import { Component, OnInit } from '@angular/core';
import {ServerService} from '../services/server-service';
import {AccountModel} from '../account/account.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  accounts: AccountModel[];

  constructor(private server: ServerService) { }

  async ngOnInit() {
    this.server.request('GET', '/accounts').subscribe((accounts: any) => {
      if (accounts) {
        this.accounts = accounts;
        // this.testvar = accounts[0].iban;
      }
    });
  }
}
