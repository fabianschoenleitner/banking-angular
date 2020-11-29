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

  constructor() { }

  ngOnInit(): void {
    this.userdata = JSON.parse(localStorage.getItem('user'));
  }

  updateSelected(name): void {
    this.selected = name;
  }

}
