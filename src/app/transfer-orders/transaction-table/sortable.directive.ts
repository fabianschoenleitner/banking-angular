import {Directive, EventEmitter, Input, Output} from '@angular/core';
import {Transaction} from '../../api/Api';

export type SortColumn = keyof Transaction | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {asc: 'desc', desc: '', '': 'asc'};

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  // suppressed because this is the ng bootstrap recommendation to implement sortable table header
  // tslint:disable-next-line:directive-selector
  selector: 'th[sortable]',
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeaderDirective {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate(): void {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}
