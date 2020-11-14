import { Component, OnInit } from '@angular/core';
import * as CanvasJS from 'src/assets/canvasjs.min';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-chart-account-history',
  templateUrl: './chart-account-history.component.html',
  styleUrls: ['./chart-account-history.component.scss']
})
export class ChartAccountHistoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let dataPoints = [
      {x: new Date(2020, 11, 8), y: 52000},
      {x: new Date(2020, 11, 9), y: 45000},
      {x: new Date(2020, 11, 10), y: 48000},
      {x: new Date(2020, 11, 11), y: 49000},
      {x: new Date(2020, 11, 12), y: 42000},
      {x: new Date(2020, 11, 13), y: 46000},
      {x: new Date(2020, 11, 14), y: 42000},
      {x: new Date(2020, 11, 15), y: 48000},
      {x: new Date(2020, 11, 16), y: 41000},
      {x: new Date(2020, 11, 17), y: 32000},
      {x: new Date(2020, 11, 18), y: 67000},
      {x: new Date(2020, 11, 19), y: 44000},
      {x: new Date(2020, 11, 20), y: 45000},
      {x: new Date(2020, 11, 21), y: 52000},
      {x: new Date(2020, 11, 22), y: 42000},
      {x: new Date(2020, 11, 23), y: 43000},
      {x: new Date(2020, 11, 24), y: 49000},
      {x: new Date(2020, 11, 25), y: 44000},
      {x: new Date(2020, 11, 26), y: 47000},
      {x: new Date(2020, 11, 27), y: 48000},
      {x: new Date(2020, 11, 28), y: 45000},
      {x: new Date(2020, 11, 29), y: 41000},
      {x: new Date(2020, 11, 30), y: 51000},
      {x: new Date(2020, 11, 31), y: 53000},
      {x: new Date(2021, 0, 1), y: 20000},
      {x: new Date(2021, 0, 2), y: 37000},
      {x: new Date(2021, 0, 3), y: 42000},
      {x: new Date(2021, 0, 4), y: 49000},
      {x: new Date(2021, 0, 5), y: 44000},
      {x: new Date(2021, 0, 6), y: 42000}
    ];
    let dataPoints2 = [
      {x: new Date(2020, 11, 8), y: 20000},
      {x: new Date(2020, 11, 9), y: 21000},
      {x: new Date(2020, 11, 10), y: 18000},
      {x: new Date(2020, 11, 11), y: 16000},
      {x: new Date(2020, 11, 12), y: 13500},
      {x: new Date(2020, 11, 13), y: 12870},
      {x: new Date(2020, 11, 14), y: 10800},
      {x: new Date(2020, 11, 15), y: 9870},
      {x: new Date(2020, 11, 16), y: 9320},
      {x: new Date(2020, 11, 17), y: 9100},
      {x: new Date(2020, 11, 18), y: 8070},
      {x: new Date(2020, 11, 19), y: 7640},
      {x: new Date(2020, 11, 20), y: -4000},
      {x: new Date(2020, 11, 21), y: -11000},
      {x: new Date(2020, 11, 22), y: -4300},
      {x: new Date(2020, 11, 23), y: 2000},
      {x: new Date(2020, 11, 24), y: 3200},
      {x: new Date(2020, 11, 25), y: 4120},
      {x: new Date(2020, 11, 26), y: 230},
      {x: new Date(2020, 11, 27), y: -8730},
      {x: new Date(2020, 11, 28), y: -11210},
      {x: new Date(2020, 11, 29), y: -13780},
      {x: new Date(2020, 11, 30), y: -17650},
      {x: new Date(2020, 11, 31), y: -20790},
      {x: new Date(2021, 0, 1), y: -21670},
      {x: new Date(2021, 0, 2), y: -24430},
      {x: new Date(2021, 0, 3), y: -26600},
      {x: new Date(2021, 0, 4), y: -30180},
      {x: new Date(2021, 0, 5), y: -24360},
      {x: new Date(2021, 0, 6), y: -18760}
    ];
    let chart = new CanvasJS.Chart("chartContainer", {
      zoomEnabled: false,
      animationEnabled: false,
      exportEnabled: false,
      title: {
        text: "30-Tage Übersicht Konto",
        fontFamily: "sans-serif"
      },
      axisX: {
        interval: 7,
        intervalType: "day"
      },
      data: [
        {
          type: "line",
          dataPoints: dataPoints
        },
        {
          type: "line",
          dataPoints: dataPoints2
        }]
    });

    let max = chart.options.data[0].dataPoints[0].y;
    let min = chart.options.data[0].dataPoints[0].y;
    for (let i = 0; i < chart.options.data[0].dataPoints.length; i++) {
      if (max < chart.options.data[0].dataPoints[i].y) {
        max = chart.options.data[0].dataPoints[i].y;
      }
      if (min > chart.options.data[0].dataPoints[i].y) {
        min = chart.options.data[0].dataPoints[i].y;
      }
    }
    for (let j = 0; j < chart.options.data[1].dataPoints.length; j++) {
      if (max < chart.options.data[1].dataPoints[j].y) {
        max = chart.options.data[1].dataPoints[j].y;
      }
      if (min > chart.options.data[1].dataPoints[j].y) {
        min = chart.options.data[1].dataPoints[j].y;
      }
    }
    let max_up = max + max / 100 * 10;
    let min_down = min - Math.abs(min) / 100 * 10;
    chart.options.axisY = {
      viewportMaximum : max_up,
      viewportMinimum : min_down,
      interval : Math.pow(10, Math.round(Math.log10((Math.abs(max) + Math.abs(min)) / 5))) * 2
    };
    chart.render();
  }
}
