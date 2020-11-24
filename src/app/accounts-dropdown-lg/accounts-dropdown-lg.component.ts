import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Account} from '../api/Api';
import {UserService} from '../services/user-service';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-accounts-dropdown-lg',
  templateUrl: './accounts-dropdown-lg.component.html',
  styleUrls: ['./accounts-dropdown-lg.component.scss', '../accounts-dropdown/accounts-dropdown.component.scss']
})
export class AccountsDropdownLgComponent implements OnInit {
  @Input() currAcc;
  @Output() currAccChange = new EventEmitter<Account>();
  accounts: Account[] = [{iban: '', balance: 0, name: '', accountType: ''}];

  constructor(private userService: UserService, private library: FaIconLibrary) {
    library.addIcons(faCaretDown);
  }

  ngOnInit(): void {
    this.userService.getAllAccounts().subscribe((acc: { accounts: Account[] }) => {
      this.accounts = acc.accounts;
      if (this.currAcc.iban === '') {
        this.currAcc = this.accounts[0];
      }
      this.changeSelectedAccount(this.currAcc);
    });
  }

  changeSelectedAccount(currentAccount: Account): void {
    // this.selectedAccount = currentAccount;
    this.currAcc = currentAccount;
    this.currAccChange.emit(currentAccount);
  }

}
