import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAccordion]',
})
export class AccordionDirective {
  constructor(private el: ElementRef) {}
  @HostListener('click')
  Accordion() {
    var elm = this.el.nativeElement.parentElement.children[1];
    var ch = this.el.nativeElement.children[0];
    if (elm.classList.contains('active') == true) {
      elm.classList.remove('active');
      ch.classList.remove('active');
    } else {
      if (document.querySelectorAll('.acc-disc.active').length > 0) {
        Array.from(document.querySelectorAll('.acc-disc.active')).forEach(
          function (elem) {
            elem.classList.remove('active');
          }
        );
        Array.from(document.querySelectorAll('.acc-title.active')).forEach(
          function (chm) {
            chm.classList.remove('active');
          }
        );
      }
      ch.classList.add('active');
      elm.classList.add('active');
    }
  }
}
