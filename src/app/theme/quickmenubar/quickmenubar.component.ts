import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-quickmenubar',
  templateUrl: './quickmenubar.component.html',
  styleUrls: ['./quickmenubar.component.scss']
})
export class QuickmenubarComponent implements OnInit {
  @Input() showToggle = true;
  @Input() showHeader = true;
  constructor() { }

  ngOnInit(): void {
  }

}
