import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LoginComponent} from './login/login.component';
import {NavbarComponent} from './navbar/navbar.component';
import {TransactionComponent} from './transaction/transaction.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {UserComponent} from './user/user.component';
import {TransferOrdersComponent} from './transfer-orders/transfer-orders.component';
import {ChartAccountHistoryComponent} from './chart-account-history/chart-account-history.component';
import {WidgetComponent} from './widget/widget.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatFormFieldModule} from '@angular/material/form-field';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ClickOutsideModule} from 'ng-click-outside';
import {AddTokenInterceptor} from './interceptor/add-token-interceptor';
import {TransactionTableComponent} from './transfer-orders/transaction-table/transaction-table.component';
import {NgbdSortableHeaderDirective} from './transfer-orders/transaction-table/sortable.directive';
import { AccountsDropdownComponent } from './accounts-dropdown/accounts-dropdown.component';
import {SubNavbarComponent} from './sub-navbar/sub-navbar.component';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { AccountsWidgetComponent } from './accounts-widget/accounts-widget.component';
import { RevenueCostsWidgetComponent } from './revenue-costs-widget/revenue-costs-widget.component';
import { TransactionWidgetComponent } from './transaction-widget/transaction-widget.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    TransactionComponent,
    UserComponent,
    ChartAccountHistoryComponent,
    WidgetComponent,
    TransferOrdersComponent,
    TransactionTableComponent,
    NgbdSortableHeaderDirective,
    AccountsDropdownComponent,
    SubNavbarComponent,
    AccountsWidgetComponent,
    RevenueCostsWidgetComponent,
    TransactionWidgetComponent,
    NewTransactionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    ClickOutsideModule,
    MatDatepickerModule,
    MatInputModule,
    FontAwesomeModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
