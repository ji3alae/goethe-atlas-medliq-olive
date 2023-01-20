import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appArrowpre]',
})
export class ArrowpreDirective {
  constructor(private el: ElementRef) {}
  @HostListener('click')
  arrowprev() {
    let actifElement = document.querySelector('.list li.active');
    let actifElementIndex = Number(actifElement.getAttribute('data-index'));
    if (actifElementIndex > 0) {
      const id = actifElementIndex - 1;
      document.querySelector('.arrow-next').classList.remove('disaple');
      document
        .querySelectorAll('.list li.active')[0]
        .classList.remove('active');
      document
        .querySelectorAll('.thumbnail-slick.active')[0]
        .classList.remove('active');
      document
        .querySelector(`.list li[data-index="${id}"]`)
        .classList.add('active');
      document
        .querySelector(`.thumbnail-slick[data-index="${id}"]`)
        .classList.add('active');
      if (id == 0) {
        document.querySelector('.arrow-pre').classList.add('disaple');
      }
    }
  }
}
