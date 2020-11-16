import { Component, OnInit } from '@angular/core';
import { Account} from '../api/Api';
import {UserService} from '../services/user-service';
import {AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-accounts-dropdown',
  templateUrl: './accounts-dropdown.component.html',
  styleUrls: ['./accounts-dropdown.component.scss']
})
export class AccountsDropdownComponent implements OnInit {
  accounts: Account[] = [{ iban: '',  balance: 0, name: '', accountType: '',  }];
  selectedAccount = { iban: '',  balance: 0, name: '', accountType: '',  };

  /*########### Form ###########*/
  registrationForm = this.fb.group({
    accountName: [this.accounts[0], [Validators.required]]
  });

  constructor(private userService: UserService, public fb: FormBuilder, private library: FaIconLibrary) {
    library.addIcons(faPlus);
  }

  ngOnInit(): void {
    this.userService.getAllAccounts().subscribe((acc: { accounts: Account[] }) => {
      this.accounts = acc.accounts;
      this.selectedAccount = acc.accounts[0];
    });
  }

  ChangeSelectedAccount(currentAccount: Account, buttonId: string): void {
    console.log(currentAccount.iban);
    this.selectedAccount = currentAccount;
  }

  /*########### Template Driven Form ###########*/
  onSubmit(): boolean {
    alert(JSON.stringify(this.registrationForm.value));
    return true;
    }
}
