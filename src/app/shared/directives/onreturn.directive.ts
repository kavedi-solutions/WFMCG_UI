import { Directive, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[onReturn]',
})
export class OnReturnDirective {
  @Input() NextControl: any;
  @Input() PreviousControl: any;

  constructor(private renderer: Renderer2) {}
  @HostListener('keydown', ['$event']) onKeyDown(e: {
    which: number;
    keyCode: number;
    shiftKey: boolean;
    currentTarget: any;
    preventDefault: () => void;
    srcElement: {
      nextElementSibling: { focus: () => void };
      previousElementSibling: { focus: () => void };
    };
  }) {
    if (e.which == 13 || e.keyCode == 13) {
      e.preventDefault();
      let control: any;
      
      control = e.currentTarget; //this.renderer.selectRootElement('#' + e.currentTarget.id);
      //control.dispatchEvent(new Event('Tab'));
      // let control: any;
      // if (e.shiftKey == true && this.PreviousControl != null) {
      //   control = this.renderer.selectRootElement('#' + this.PreviousControl);
      //   ControlElement(control, true);
      // } else if (e.shiftKey == false && this.NextControl != null) {
      //   control = this.renderer.selectRootElement('#' + this.NextControl);
      //   ControlElement(control, false);
      // }
    }

    function ControlElement(control: any, IsPrevious: boolean) {
      while (true) {
        if (control) {
          if (
            !control.hidden &&
            (control.nodeName == 'INPUT' ||
              control.nodeName == 'SELECT' ||
              control.nodeName == 'BUTTON' ||
              control.nodeName == 'TEXTAREA' ||
              control.nodeName == 'MAT-SELECT')
          ) {
            control.focus();
            return;
          } else {
            if (IsPrevious == true) {
              control = control.previousElementSibling;
            } else {
              control = control.nextElementSibling;
            }
          }
        } else {
          return;
        }
      }
    }
  }
}
