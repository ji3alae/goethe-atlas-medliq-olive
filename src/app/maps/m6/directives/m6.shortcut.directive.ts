import { Directive,ElementRef,HostListener } from '@angular/core';

@Directive({
  selector: '[appShortcut]'
})
export class ShortcutDirective {

  constructor(private el: ElementRef) { }
  @HostListener('click')
  prevFunc()
  {
    const div = document.querySelector('.model-content');
    div.scroll({
      top: 0,
      behavior: 'smooth'
    });
  }
}
