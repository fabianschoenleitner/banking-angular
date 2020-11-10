import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TransactionComponent } from './transaction/transaction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TableListComponent } from './table-list/table-list.component';
import {AuthService} from './services/auth-service';
import { UserComponent } from './user/user.component';
import { TransferOrdersComponent } from './transfer-orders/transfer-orders.component';

import { ChartAccountHistoryComponent } from './chart-account-history/chart-account-history.component';
import { WidgetComponent } from './widget/widget.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    TransactionComponent,
    TableListComponent,
    UserComponent,
    ChartAccountHistoryComponent,
    WidgetComponent,
    TransferOrdersComponent
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
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
