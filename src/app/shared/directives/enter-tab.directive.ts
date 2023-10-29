import {
  Directive,
  Renderer2,
  ContentChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[enter-tab]',
})
export class EnterTabDirective {
  @ContentChildren('nextTab', {descendants: true}) controls?: QueryList<any>;
  //nextTab: any;

  constructor(private renderer: Renderer2, private el: ElementRef) {}
  ngAfterViewInit(): void {
    this.controls!.changes.subscribe((controls) => {
      this.createKeydownEnter(controls);
    });
    if (this.controls!.length) {
      this.createKeydownEnter(this.controls);
    }
  }
  private createKeydownEnter(querycontrols?: QueryList<any>) {
    querycontrols!.forEach((c) => {      
      this.renderer.listen(c.nativeElement, 'keydown.enter', (event) => {        
        if (this.controls!.last != c) {
          let controls = querycontrols!.toArray();
          let index = controls.findIndex((d) => d == c);
          if (index >= 0) {
            let nextControl = controls.find(
              (n, i) => n && !n.nativeElement.attributes.disabled && i > index
            );
            if (nextControl) {
              nextControl.nativeElement.focus();
              event.preventDefault();
            }
          }
        }
      });
    });
  }
}
