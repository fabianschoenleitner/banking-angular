import {Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ServerService} from '../services/server-service';


import {ChartAccountHistoryComponent} from '../chart-account-history/chart-account-history.component';
import {WidgetComponent} from '../widget/widget.component';

import {AccountModel} from '../account/account.model';
import {TransactionModel} from '../transaction/transaction-model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  accounts: AccountModel[] = [];

  @ViewChild('parent', {read: ViewContainerRef}) target: ViewContainerRef;
  private componentRef: ComponentRef<any>;


  constructor(private server: ServerService, private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.server.request('GET', '/accounts').subscribe((accounts: AccountModel[]) => {
      if (accounts) {
        this.accounts = accounts;
        for (const acc in this.accounts) {
          if (this.accounts.hasOwnProperty(acc)) {
            const path = '/transactions/' + this.accounts[acc].iban;
            this.server.request('POST', path).subscribe((transactions: TransactionModel[]) => {
              if (transactions) {
                this.accounts[acc].transactions = transactions;
              }
            });
          }
        }
      }
    });
  }

  addComponent() {
    let childComponent = this.resolver.resolveComponentFactory(WidgetComponent);
    this.componentRef = this.target.createComponent(childComponent); // TODO: lieber mit ngFor das ganze
  }


}
