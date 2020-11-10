import {Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ServerService} from '../services/server-service';
<<<<<<< HEAD
=======
import {ChartAccountHistoryComponent} from '../chart-account-history/chart-account-history.component';
import {WidgetComponent} from '../widget/widget.component';
>>>>>>> master
import {AccountModel} from '../account/account.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  accounts: AccountModel[];

  @ViewChild('parent', {read : ViewContainerRef}) target: ViewContainerRef;
  private componentRef: ComponentRef<any>;

<<<<<<< HEAD
=======
  constructor(private server: ServerService, private resolver: ComponentFactoryResolver) { }

>>>>>>> master
  async ngOnInit() {
    this.server.request('GET', '/accounts').subscribe((accounts: any) => {
      if (accounts) {
        this.accounts = accounts;
        // this.testvar = accounts[0].iban;
      }
    });
  }

  addComponent() {
    let childComponent = this.resolver.resolveComponentFactory(WidgetComponent);
    this.componentRef = this.target.createComponent(childComponent); // TODO: lieber mit ngFor das ganze
  }
}
