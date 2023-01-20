

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-m6-infobar',
  templateUrl: './m6-infobar.component.html',
  styleUrls: ['./m6-infobar.component.less']
})
export class infobarComponent implements OnInit {
  @Input() hideHeader = false;
  @Output() info = new EventEmitter<boolean>();



  constructor() { }

  ngOnInit(): void {
  }

}
