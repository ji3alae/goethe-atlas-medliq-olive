

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-m6-seclayout',
  templateUrl: './m6.seclayout.component.html',
  styleUrls: ['./m6.seclayout.component.less']
})

export class SeclayoutComponent implements OnInit {
  @Input() hideHeader = false;
  @Output() info = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void { }
}
