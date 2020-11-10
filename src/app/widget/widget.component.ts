import {Component, OnInit} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {
  selected: 'No widget'; // TODO: syntaxfehler

  constructor() {
  }

  ngOnInit(): void {
  }
}
