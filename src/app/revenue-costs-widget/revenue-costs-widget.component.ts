import {Component, Input, OnInit} from '@angular/core';
import * as CanvasJS from 'src/assets/canvasjs.min';
import {Account, Iban, TransactionRequest, TransactionResponse} from '../api/Api';
import {UserService} from '../services/user-service';

@Component({
  selector: 'app-revenue-costs-widget',
  templateUrl: './revenue-costs-widget.component.html',
  styleUrls: ['./revenue-costs-widget.component.scss']
})
export class RevenueCostsWidgetComponent implements OnInit {
  @Input() idName: string = 'default';
  account: Account = {iban: '', balance: 0, name: '', accountType: '', limit: 0};
  ibanArr: Iban[] = [];
  transactionResponse: TransactionResponse[] =
    [{
      transactions: [{
        timestamp: new Date(),
        amount: 0,
        text: '',
        textType: '',
        type: '',
        iban: '',
        complementaryIban: '',
        complementaryName: ''
      }],
      lastDate: new Date()
    }];
  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  getAccount(account: Account): void {
    this.account = account;
    const userData = JSON.parse(localStorage.getItem('user'));
    this.ibanArr = JSON.parse(localStorage.getItem('user')).accounts;
    let ibanArr = [this.account.iban];

    if (this.account.name === 'Alle Konten') {
      ibanArr = userData.accounts;
    }

    const request: TransactionRequest = {n: 100, stored: false};
    this.userService.getTransactions(request, ibanArr).subscribe((response: TransactionResponse[]) => {
      this.transactionResponse = [];
      for (const transactionResponse of response) {
        this.transactionResponse.push(transactionResponse);
      }
    });
  }

  ngAfterViewInit() {
    const ein = 4312.21;
    let aus = -2367.32;
    if (aus < 0) {
      aus = aus * -1;
    }
    const chart = new CanvasJS.Chart(this.idName, {
      animationEnabled: true,
      exportEnabled: false,
      backgroundColor: 'transparent',
      dataPointWidth: 100,
      axisY: {
        lineThickness: 0,
        gridThickness: 0,
        title: '',
        tickLength: 0,
        margin: 0,
        labelFormatter: function(e) {
          return '';
        },
        viewportMaximum : ein,
        viewportMinimum : 0
      },
      axisX: {
        lineThickness: 0,
        tickThickness: 0,
        labelFontSize: 15,
        labelAngle: 0,
        labelFontWeight: 'lighter'
      },
      data: [{
        type: 'column',
        dataPoints: [
          { y: ein, label: 'Eingänge: +' + ein + '€', color: '#66CF5F' },
          { y: aus, label: 'Ausgänge: ' + (aus * -1) + '€', color: '#EB4E3D' }
        ]
      }]
    });

    chart.render();
  }

}
