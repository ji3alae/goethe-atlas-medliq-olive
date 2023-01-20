import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPagination]',
})
export class PaginationDirective {
  constructor(private el: ElementRef) {}
  @HostListener('click')
  pagination() {
    var elm = this.el.nativeElement;
    Array.from(document.querySelectorAll('.list li.active')).forEach(function (
      elem
    ) {
      elem.classList.remove('active');
    });
    Array.from(document.querySelectorAll('.thumbnail-slick')).forEach(function (
      elem
    ) {
      elem.classList.remove('active');
    });
    elm.classList.add('active');
    var index = elm.getAttribute('data-index');

    const thumbnailSlick = document.querySelector(
      `.thumbnail-slick[data-index="${index}"]`
    );
    thumbnailSlick.classList.add('active');

    const arrowNext = document.querySelector('.arrow-next');
    const arrowPre = document.querySelector('.arrow-pre');

    const list = document.querySelector('.list');
    const listItems = list.querySelectorAll('li');

    if (index === listItems.length - 1) {
      arrowNext.classList.add('disaple');
      arrowPre.classList.remove('disaple');
    }

    if (index === 0) {
      arrowPre.classList.add('disaple');
      arrowNext.classList.remove('disaple');
    }

    if (index !== 0 && index !== listItems.length - 1) {
      arrowPre.classList.remove('disaple');
      arrowNext.classList.remove('disaple');
    }
  }
}
