import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSynch]',
})
export class SynchDirective {
  constructor(private el: ElementRef) {}
  @HostListener('click')
  prevFunc() {
    const slideElements = document.querySelectorAll('.slide-item-v.active');
    slideElements.forEach((elem) => {
      elem.classList.remove('active');
    });

    this.el.nativeElement.parentElement.parentElement.classList.add('active');
    const elm = Number(this.el.nativeElement.getAttribute('data-index'));
    const count = document.querySelectorAll('.slide-item.item').length;
    for (let i = 0; i < count; i++) {
      const item = document.querySelector(
        `.slider-wrap .item[data-index="${i}"]`
      );
        document.querySelector('.slider-main').appendChild(item);
    }
      for (let i = 0; i < elm; i++) {
        const item = document.querySelector(
          `.slider-wrap .item[data-index="${i}"]`
          );
      document.querySelector('.slider-main').appendChild(item);
    }
  }
}
