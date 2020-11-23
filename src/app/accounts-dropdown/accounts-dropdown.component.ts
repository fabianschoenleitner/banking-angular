import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Account, Transaction} from '../api/Api';
import {UserService} from '../services/user-service';
import {faPlus, faCaretDown} from '@fortawesome/free-solid-svg-icons';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {SortColumn} from '../transfer-orders/transaction-table/sortable.directive';

@Component({
  selector: 'app-accounts-dropdown',
  templateUrl: './accounts-dropdown.component.html',
  styleUrls: ['./accounts-dropdown.component.scss']
})
export class AccountsDropdownComponent implements OnInit {

  constructor(private userService: UserService, private library: FaIconLibrary) {
    library.addIcons(faPlus, faCaretDown);
  }
  @Output() currAcc = new EventEmitter<Account>();
  accounts: Account[] = [{iban: '', balance: 0, name: '', accountType: '',}];
  selectedAccount = {iban: '', balance: 0, name: '', accountType: '',};

  ngOnInit(): void {
    this.userService.getAllAccounts().subscribe((acc: { accounts: Account[] }) => {
      this.accounts = acc.accounts;
      this.selectedAccount = acc.accounts[0];
      this.addAllAccountsEntry();
      this.changeSelectedAccount(this.selectedAccount);
    });
  }

  addAllAccountsEntry(): void {
    let sum = 0;
    for (const acc of this.accounts) {
      sum = sum + acc.balance;
    }
    this.accounts.splice(0, 0, {iban: '', balance: sum, name: 'Alle Konten', accountType: 'All',});
  }

  changeSelectedAccount(currentAccount: Account): void {
    this.selectedAccount = currentAccount;
    this.currAcc.emit(currentAccount);
  }

}
