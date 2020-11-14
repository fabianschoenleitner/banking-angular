import {Component, Input, OnInit} from '@angular/core';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {
  @Input() selected = 'empty';
  hasWidget: boolean;

  updateSelectedChart(): void {
    this.selected = 'chart';
  }

  constructor() {
  }

  ngOnInit(): void {
    if (this.selected !== 'empty') {
      this.hasWidget = true;
    }
  }
}
