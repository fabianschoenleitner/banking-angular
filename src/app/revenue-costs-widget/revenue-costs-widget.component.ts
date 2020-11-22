import {Component, Input, OnInit} from '@angular/core';
import * as CanvasJS from 'src/assets/canvasjs.min';

@Component({
  selector: 'app-revenue-costs-widget',
  templateUrl: './revenue-costs-widget.component.html',
  styleUrls: ['./revenue-costs-widget.component.scss']
})
export class RevenueCostsWidgetComponent implements OnInit {
  @Input() idName: string = 'default';

  constructor() { }

  ngOnInit(): void {
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
