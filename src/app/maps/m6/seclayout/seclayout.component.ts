

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-seclayout',
  templateUrl: './seclayout.component.html',
  styleUrls: ['./seclayout.component.less']
})
export class SeclayoutComponent implements OnInit {
  @Input() hideHeader = false;
  @Output() info = new EventEmitter<boolean>();
 


  constructor() { }

  ngOnInit(): void {
  }

}
