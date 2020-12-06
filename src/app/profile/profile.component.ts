import {Component, OnInit} from '@angular/core';
import {UserData} from '../api/Api';
import {NgbCalendar, NgbDate} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  selected = 'pdata';
  userdata: UserData;
  cards;
  news;
  today;
  maxDate;
  calendar;
  disabled;

  constructor(calendar: NgbCalendar) {
    this.calendar = calendar;
    this.disabled = (date: NgbDate) => this.calendar.getWeekday(date) > 6;
  }

  ngOnInit(): void {
    this.today = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 21);
    this.userdata = JSON.parse(localStorage.getItem('user'));
    this.cards = [
      {limit: 1000, available: 840, cardnr: 'SD12345678', ctype: 'Debit'},
      {limit: 1200, available: 1200, cardnr: 'XS65471253', ctype: 'Kredit'}
      ];
    this.news = [
      {newstitle: 'Title N.1', newsbody: 'Lorem ipsum dolor sit amet, consetetur sadipscing iltr, sed diam nonumy eirmod tempor invidut ut labore et dolore magna aliquyam erat, sed diam voluptua.', link: 'https://www.blank.org/', date: '05.12.2020'},
      {newstitle: 'Title N.2', newsbody: 'Hier stehen ihre Bankneuigkeiten, oder auch dieser Fülltext, den ich nur deswegen verfasst habe weil es Arbeit wäre den Browser zu öffnen um ein Lorem Ipsum zu kopieren.', link: 'https://www.blank.org/', date: '04.12.2020'}
    ];
  }

  updateSelected(name): void {
    this.selected = name;
  }

  makeAppointment(): void {  }

}
