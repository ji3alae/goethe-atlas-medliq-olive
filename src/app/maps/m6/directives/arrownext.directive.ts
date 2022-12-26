import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appArrownext]',
})
export class ArrownextDirective {
  constructor(private el: ElementRef) {}
  @HostListener('click')
  arrownext() {
    let actifElement = document.querySelector('.list li.active');
    let actifElementIndex = Number(actifElement.getAttribute('data-index'));
    if (actifElementIndex + 1 < document.querySelectorAll('.list li').length) {
      let id = actifElementIndex + 1;
      document.querySelector('.arrow-pre').classList.remove('disaple');
      document
        .querySelectorAll('.list li.active')[0]
        .classList.remove('active');
      document
        .querySelectorAll('.thumbnail-slick.active')[0]
        .classList.remove('active');
      document
        .querySelectorAll(`.list li[data-index="${id}"]`)[0]
        .classList.add('active');
      document
        .querySelectorAll(`.thumbnail-slick[data-index="${id}"]`)[0]
        .classList.add('active');
      if (id == document.querySelectorAll('.list li').length - 1) {
        document.querySelector('.arrow-next').classList.add('disaple');
      }
    }
  }
}
