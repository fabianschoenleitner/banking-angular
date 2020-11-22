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
  deleteID: string;
  idString: string;
  hasWidget: boolean;

  updateSelected(name): void {
    this.selected = name;
  }

  deleteWidget(event): void {
    const node = document.getElementById(this.deleteID);
    node.parentElement.parentElement.setAttribute("style", "flex-basis: calc(33.3% - 32px);");
    node.parentElement.parentElement.setAttribute("class", "square shadow  m-2 pt-2");
    node.parentElement.parentElement.parentElement.removeChild(node.parentNode.parentNode);
  }

  changeWidgetSize(size): void {
    const node = document.getElementById(this.deleteID);
    node.parentElement.parentElement.setAttribute("style", "flex-basis: calc(66.6% - 32px);");
    node.parentElement.parentElement.setAttribute("class", "square2 shadow  m-2 pt-2");
  }

  constructor() {
  }

  ngOnInit(): void {
    this.idString = this.id.toString();
    this.deleteID = this.idString + 'delete';
    if (this.selected !== 'empty') {
      this.hasWidget = true;
    }
  }
}
