import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class M6ModelMapService {

  sendData = new Subject();
  constructor() { }
  comunicatedData(data) {
    this.sendData.next(data);
  }
}
