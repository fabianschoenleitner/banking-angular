import {Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {WidgetComponent} from '../widget/widget.component';
import {Transaction, TransactionRequest, UserData} from '../api/Api';
import {UserService} from '../services/user-service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @ViewChild('parent', {read: ViewContainerRef}) target: ViewContainerRef;
  private componentRef: ComponentRef<any>;
  public userData: UserData;

  constructor(private userService: UserService, private resolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    this.userData = this.userService.getUserData();
  }

  addComponent(): void {
    const childComponent = this.resolver.resolveComponentFactory(WidgetComponent);
    this.componentRef = this.target.createComponent(childComponent); // TODO: lieber mit ngFor das ganze
  }
}
