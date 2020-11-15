import {Component, Input, OnInit} from '@angular/core';
import {Widget} from '../user/user.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {
  @Input() selected = 'empty';
  @Input() id = 0;
  idString: string;
  hasWidget: boolean;

  updateSelectedChart(): void {
    this.selected = 'chart';
  }

  constructor() {
  }

  ngOnInit(): void {
    this.idString = this.id.toString();
    if (this.selected !== 'empty') {
      this.hasWidget = true;
    }
  }
}
