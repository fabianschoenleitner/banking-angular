import {Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';

import {WidgetComponent} from '../widget/widget.component';
import {Account, Transaction} from '../api/Api';
import {HttpClient} from '@angular/common/http';
const baseUrl = 'http://localhost:10101';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  accounts: Account[] = [];

  @ViewChild('parent', {read: ViewContainerRef}) target: ViewContainerRef;
  private componentRef: ComponentRef<any>;


  constructor(private http: HttpClient, private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.http.request('GET', baseUrl + '/accounts').subscribe((accounts: Account[]) => {
      if (accounts) {
        this.accounts = accounts;
        for (const acc in this.accounts) {
          if (this.accounts.hasOwnProperty(acc)) {
            const path = '/transactions/' + this.accounts[acc].iban;
            this.http.request('POST', baseUrl + path).subscribe((transactions: Transaction[]) => {
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
