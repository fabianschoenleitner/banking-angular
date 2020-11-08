import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {TransactionComponent} from './transaction/transaction.component';
import {UserComponent} from './user/user.component';
import {TransferOrdersComponent} from './transfer-orders/transfer-orders.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'transaction',
    component: TransactionComponent
  },
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'transfer_orders',
    component: TransferOrdersComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
