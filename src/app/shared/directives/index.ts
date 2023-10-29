import { AccordionDirective } from './accordion.directive';
import { AccordionAnchorDirective } from './accordionanchor.directive';
import { AccordionItemDirective } from './accordionItem.directive';
import { EnableControlDirective } from './enable-control.directive';
import { EnterTabDirective } from './enter-tab.directive';

export const Directive: any[] = [
  AccordionDirective,
  AccordionItemDirective,
  AccordionAnchorDirective,
  EnableControlDirective,
  EnterTabDirective,
];

export * from './accordion.directive';
export * from './accordionanchor.directive';
export * from './accordionItem.directive';
export * from './enable-control.directive';
export * from './enter-tab.directive';
