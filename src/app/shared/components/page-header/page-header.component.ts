import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'page-header',
  host: {
    class: 'matero-page-header',
  },
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PageHeaderComponent implements OnInit {
  @Input() title = '';
  @Input() addButtonToolTip = 'Add';
  @Input() backButtonToolTip = 'Add';
  @Input() showBack: Boolean = false;
  @Input() showAdd: Boolean = true;


  @Output() onAddClick = new EventEmitter();
  @Output() onBackClick = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  clickEvent() {}
}
