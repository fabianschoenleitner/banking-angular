import {Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ServerService} from '../services/server-service';
import {ChartAccountHistoryComponent} from '../chart-account-history/chart-account-history.component';
import {WidgetComponent} from '../widget/widget.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  name: string;
  verfugernr: string;

  @ViewChild('parent', {read : ViewContainerRef}) target: ViewContainerRef;
  private componentRef: ComponentRef<any>;

  constructor(private server: ServerService, private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.server.request('GET', '/profile').subscribe((accounts: any) => {
      if (accounts) {
        this.name = accounts.name;
        this.verfugernr = accounts.verfugernr;
      }
    });
  }

  addComponent() {
    let childComponent = this.resolver.resolveComponentFactory(WidgetComponent);
    this.componentRef = this.target.createComponent(childComponent);
  }
}
