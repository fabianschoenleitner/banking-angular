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
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ClickOutsideModule} from 'ng-click-outside';
import {AddTokenInterceptor} from './interceptor/add-token-interceptor';
import {TransactionTableComponent} from './transfer-orders/transaction-table/transaction-table.component';
import {NgbdSortableHeader} from './transfer-orders/transaction-table/sortable.directive';

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
    NgbdSortableHeader
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
    MatSelectModule,
    ClickOutsideModule
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
