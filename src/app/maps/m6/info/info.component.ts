import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';

import * as marked from 'marked';
import { M6Service } from '../m6.service';
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit {

  @Output() close = new EventEmitter();

  marked = marked;

  constructor(public m6: M6Service) { }

  ngOnInit(): void {
  }

}
