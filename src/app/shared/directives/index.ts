import { AccordionDirective } from './accordion.directive';
import { AccordionAnchorDirective } from './accordionanchor.directive';
import { AccordionItemDirective } from './accordionItem.directive';
import { OnReturnDirective } from './onreturn.directive';

export const Directive: any[] = [
  AccordionDirective,
  AccordionItemDirective,
  AccordionAnchorDirective,
  OnReturnDirective
];

export * from './accordion.directive';
export * from './accordionanchor.directive';
export * from './accordionItem.directive';
export * from './onreturn.directive';