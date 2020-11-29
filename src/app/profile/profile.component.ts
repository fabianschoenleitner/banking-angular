import {Component, OnInit} from '@angular/core';
import {UserData} from '../api/Api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  selected = 'pdata';
  userdata: UserData;
  cards;

  constructor() { }

  ngOnInit(): void {
    this.userdata = JSON.parse(localStorage.getItem('user'));
    this.cards = [
      {limit: 1000, available: 840, cardnr: 'SD12345678', ctype: 'Debit'},
      {limit: 1200, available: 1200, cardnr: 'XS65471253', ctype: 'Kredit'}
      ];
  }

  updateSelected(name): void {
    this.selected = name;
  }

}
