import {
  Component,
  Input,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Renderer2,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  NgZone,
  ViewChildren,
  QueryList,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { CanColor, mixinColor } from '@angular/material/core';
import { Observable, Subscriber, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import {
  MtxSplitArea,
  MtxSplitPoint,
  MtxSplitSnapshot,
  MtxSplitAreaSnapshot,
  MtxSplitOutputData,
  MtxSplitOutputAreaSizes,
} from './interface';
import { MtxSplitPaneDirective } from './split-pane.directive';
import {
  getInputPositiveNumber,
  getInputBoolean,
  isUserSizesValid,
  getAreaMinSize,
  getAreaMaxSize,
  getPointFromEvent,
  getElementPixelSize,
  getGutterSideAbsorptionCapacity,
  updateAreaSize,
} from './utils';

// Boilerplate for applying mixins to _MtxSplitComponentBase.
/** @docs-private */
const _MtxSplitComponentBase = mixinColor(
  class {
    constructor(public _elementRef: ElementRef) {}
  }
);

/**
 * mtx-split
 *
 *
 *  PERCENT MODE ([unit]="'percent'")
 *  ___________________________________________________________________________________________
 * |       A       [g1]       B       [g2]       C       [g3]       D       [g4]       E       |
 * |-------------------------------------------------------------------------------------------|
 * |       20                 30                 20                 15                 15      | <-- [size]="x"
 * |               10px               10px               10px               10px               | <-- [gutterSize]="10"
 * |calc(20% - 8px)    calc(30% - 12px)   calc(20% - 8px)    calc(15% - 6px)    calc(15% - 6px)| <-- CSS flex-basis property (with flex-grow&shrink at 0)
 * |     152px              228px              152px              114px              114px     | <-- el.getBoundingClientRect().width
 * |___________________________________________________________________________________________|
 *                                                                                 800px         <-- el.getBoundingClientRect().width
 *  flex-basis = calc( { area.size }% - { area.size/100 * nbGutter*gutterSize }px );
 *
 *
 *  PIXEL MODE ([unit]="'pixel'")
 *  ___________________________________________________________________________________________
 * |       A       [g1]       B       [g2]       C       [g3]       D       [g4]       E       |
 * |-------------------------------------------------------------------------------------------|
 * |      100                250                 *                 150                100      | <-- [size]="y"
 * |               10px               10px               10px               10px               | <-- [gutterSize]="10"
 * |   0 0 100px          0 0 250px           1 1 auto          0 0 150px          0 0 100px   | <-- CSS flex property (flex-grow/flex-shrink/flex-basis)
 * |     100px              250px              200px              150px              100px     | <-- el.getBoundingClientRect().width
 * |___________________________________________________________________________________________|
 *                                                                                 800px         <-- el.getBoundingClientRect().width
 *
 */

@Component({
  selector: 'mtx-split',
  exportAs: 'mtxSplit',
  host: {
    class: 'mtx-split',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [`./split.component.scss`],
  templateUrl: './split.component.html',
  inputs: ['color'],
})
export class MtxSplitComponent
  extends _MtxSplitComponentBase
  implements AfterViewInit, OnDestroy, CanColor
{
  private _direction: 'horizontal' | 'vertical' = 'horizontal';

  @Input() set direction(v: 'horizontal' | 'vertical') {
    this._direction = v === 'vertical' ? 'vertical' : 'horizontal';

    this.renderer.addClass(this.elRef.nativeElement, `mtx-split-${this._direction}`);
    this.renderer.removeClass(
      this.elRef.nativeElement,
      `mtx-split-${this._direction === 'vertical' ? 'horizontal' : 'vertical'}`
    );

    this.build(false, false);
  }

  get direction(): 'horizontal' | 'vertical' {
    return this._direction;
  }

  ////

  private _unit: 'percent' | 'pixel' = 'percent';

  @Input() set unit(v: 'percent' | 'pixel') {
    this._unit = v === 'pixel' ? 'pixel' : 'percent';

    this.renderer.addClass(this.elRef.nativeElement, `mtx-split-${this._unit}`);
    this.renderer.removeClass(
      this.elRef.nativeElement,
      `mtx-split-${this._unit === 'pixel' ? 'percent' : 'pixel'}`
    );

    this.build(false, true);
  }

  get unit(): 'percent' | 'pixel' {
    return this._unit;
  }

  ////

  private _gutterSize = 4;

  @Input() set gutterSize(v: number) {
    this._gutterSize = getInputPositiveNumber(v, 11);

    this.build(false, false);
  }

  get gutterSize(): number {
    return this._gutterSize;
  }

  ////

  private _gutterStep = 1;

  @Input() set gutterStep(v: number) {
    this._gutterStep = getInputPositiveNumber(v, 1);
  }

  get gutterStep(): number {
    return this._gutterStep;
  }

  ////

  private _restrictMove = false;

  @Input() set restrictMove(v: boolean) {
    this._restrictMove = getInputBoolean(v);
  }

  get restrictMove(): boolean {
    return this._restrictMove;
  }

  ////

  private _useTransition = false;

  @Input() set useTransition(v: boolean) {
    this._useTransition = getInputBoolean(v);

    if (this._useTransition) {
      this.renderer.addClass(this.elRef.nativeElement, 'mtx-split-transition');
    } else {
      this.renderer.removeClass(this.elRef.nativeElement, 'mtx-split-transition');
    }
  }

  get useTransition(): boolean {
    return this._useTransition;
  }

  ////

  private _disabled = false;

  @Input() set disabled(v: boolean) {
    this._disabled = getInputBoolean(v);

    if (this._disabled) {
      this.renderer.addClass(this.elRef.nativeElement, 'mtx-split-disabled');
    } else {
      this.renderer.removeClass(this.elRef.nativeElement, 'mtx-split-disabled');
    }
  }

  get disabled(): boolean {
    return this._disabled;
  }

  ////

  private _dir: 'ltr' | 'rtl' = 'ltr';

  @Input() set dir(v: 'ltr' | 'rtl') {
    this._dir = v === 'rtl' ? 'rtl' : 'ltr';

    this.renderer.setAttribute(this.elRef.nativeElement, 'dir', this._dir);
  }

  get dir(): 'ltr' | 'rtl' {
    return this._dir;
  }

  ////

  private _gutterDblClickDuration = 0;

  @Input() set gutterDblClickDuration(v: number) {
    this._gutterDblClickDuration = getInputPositiveNumber(v, 0);
  }

  get gutterDblClickDuration(): number {
    return this._gutterDblClickDuration;
  }

  ////

  @Output() dragStart = new EventEmitter<MtxSplitOutputData>(false);
  @Output() dragEnd = new EventEmitter<MtxSplitOutputData>(false);
  @Output() gutterClick = new EventEmitter<MtxSplitOutputData>(false);
  @Output() gutterDblClick = new EventEmitter<MtxSplitOutputData>(false);

  private transitionEndSubscriber!: Subscriber<MtxSplitOutputAreaSizes>;
  @Output() get transitionEnd(): Observable<MtxSplitOutputAreaSizes> {
    return new Observable(subscriber => (this.transitionEndSubscriber = subscriber)).pipe(
      debounceTime<any>(20)
    );
  }

  private dragProgressSubject: Subject<MtxSplitOutputData> = new Subject();
  dragProgress$: Observable<MtxSplitOutputData> = this.dragProgressSubject.asObservable();

  ////

  private isDragging = false;
  private dragListeners: Array<() => void> = [];
  private snapshot: MtxSplitSnapshot | null = null;
  private startPoint: MtxSplitPoint | null = null;
  private endPoint: MtxSplitPoint | null = null;

  public readonly displayedAreas: Array<MtxSplitArea> = [];
  private readonly hidedAreas: Array<MtxSplitArea> = [];

  @ViewChildren('gutterEls') private gutterEls!: QueryList<ElementRef>;

  constructor(
    private ngZone: NgZone,
    private elRef: ElementRef,
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2
  ) {
    super(elRef);
    // To force adding default class, could be override by user @Input() or not
    this.direction = this._direction;
  }

  public ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      // To avoid transition at first rendering
      setTimeout(() => this.renderer.addClass(this.elRef.nativeElement, 'mtx-split-init'));
    });
  }

  private getNbGutters(): number {
    return this.displayedAreas.length === 0 ? 0 : this.displayedAreas.length - 1;
  }

  public addArea(component: MtxSplitPaneDirective): void {
    const newArea: MtxSplitArea = {
      component,
      order: 0,
      size: 0,
      minSize: null,
      maxSize: null,
    };

    if (component.visible === true) {
      this.displayedAreas.push(newArea);

      this.build(true, true);
    } else {
      this.hidedAreas.push(newArea);
    }
  }

  public removeArea(component: MtxSplitPaneDirective): void {
    if (this.displayedAreas.some(a => a.component === component)) {
      const area = this.displayedAreas.find(a => a.component === component) as MtxSplitArea;
      this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);

      this.build(true, true);
    } else if (this.hidedAreas.some(a => a.component === component)) {
      const area = this.hidedAreas.find(a => a.component === component) as MtxSplitArea;
      this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
    }
  }

  public updateArea(
    component: MtxSplitPaneDirective,
    resetOrders: boolean,
    resetSizes: boolean
  ): void {
    if (component.visible === true) {
      this.build(resetOrders, resetSizes);
    }
  }

  public showArea(component: MtxSplitPaneDirective): void {
    const area = this.hidedAreas.find(a => a.component === component);
    if (area === undefined) {
      return;
    }

    const areas = this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
    this.displayedAreas.push(...areas);

    this.build(true, true);
  }

  public hideArea(comp: MtxSplitPaneDirective): void {
    const area = this.displayedAreas.find(a => a.component === comp);
    if (area === undefined) {
      return;
    }

    const areas = this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
    areas.forEach(_area => {
      _area.order = 0;
      _area.size = 0;
    });
    this.hidedAreas.push(...areas);

    this.build(true, true);
  }

  public getVisibleAreaSizes(): MtxSplitOutputAreaSizes {
    return this.displayedAreas.map(a => (a.size === null ? '*' : a.size));
  }

  public setVisibleAreaSizes(sizes: MtxSplitOutputAreaSizes): boolean {
    if (sizes.length !== this.displayedAreas.length) {
      return false;
    }

    const formatedSizes = sizes.map(s => getInputPositiveNumber(s, null)) as number[];
    const isValid = isUserSizesValid(this.unit, formatedSizes);

    if (isValid === false) {
      return false;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.displayedAreas.forEach((area, i) => (area.component._size = formatedSizes[i]));

    this.build(false, true);
    return true;
  }

  private build(resetOrders: boolean, resetSizes: boolean): void {
    this.stopDragging();

    // ¤ AREAS ORDER

    if (resetOrders === true) {
      // If user provided 'order' for each area, use it to sort them.
      if (this.displayedAreas.every(a => a.component.order !== null)) {
        this.displayedAreas.sort(
          (a, b) => ((a.component.order as number) - (b.component.order as number)) as number
        );
      }

      // Then set real order with multiples of 2, numbers between will be used by gutters.
      this.displayedAreas.forEach((area, i) => {
        area.order = i * 2;
        area.component.setStyleOrder(area.order);
      });
    }

    // ¤ AREAS SIZE

    if (resetSizes === true) {
      const useUserSizes = isUserSizesValid(
        this.unit,
        this.displayedAreas.map(a => a.component.size) as number[]
      );

      switch (this.unit) {
        case 'percent': {
          const defaultSize = 100 / this.displayedAreas.length;

          this.displayedAreas.forEach(area => {
            area.size = useUserSizes ? (area.component.size as number) : defaultSize;
            area.minSize = getAreaMinSize(area);
            area.maxSize = getAreaMaxSize(area);
          });
          break;
        }
        case 'pixel': {
          if (useUserSizes) {
            this.displayedAreas.forEach(area => {
              area.size = area.component.size;
              area.minSize = getAreaMinSize(area);
              area.maxSize = getAreaMaxSize(area);
            });
          } else {
            const wildcardSizeAreas = this.displayedAreas.filter(a => a.component.size === null);

            // No wildcard area > Need to select one arbitrarily > first
            if (wildcardSizeAreas.length === 0 && this.displayedAreas.length > 0) {
              this.displayedAreas.forEach((area, i) => {
                area.size = i === 0 ? null : area.component.size;
                area.minSize = i === 0 ? null : getAreaMinSize(area);
                area.maxSize = i === 0 ? null : getAreaMaxSize(area);
              });
            }
            // More than one wildcard area > Need to keep only one arbitrarly > first
            else if (wildcardSizeAreas.length > 1) {
              let alreadyGotOne = false;
              this.displayedAreas.forEach(area => {
                if (area.component.size === null) {
                  if (alreadyGotOne === false) {
                    area.size = null;
                    area.minSize = null;
                    area.maxSize = null;
                    alreadyGotOne = true;
                  } else {
                    area.size = 100;
                    area.minSize = null;
                    area.maxSize = null;
                  }
                } else {
                  area.size = area.component.size;
                  area.minSize = getAreaMinSize(area);
                  area.maxSize = getAreaMaxSize(area);
                }
              });
            }
          }
          break;
        }
      }
    }

    this.refreshStyleSizes();
    this.cdRef.markForCheck();
  }

  private refreshStyleSizes(): void {
    ///////////////////////////////////////////
    // PERCENT MODE
    if (this.unit === 'percent') {
      // Only one area > flex-basis 100%
      if (this.displayedAreas.length === 1) {
        this.displayedAreas[0].component.setStyleFlex(0, 0, `100%`, false, false);
      }
      // Multiple areas > use each percent basis
      else {
        const sumGutterSize = this.getNbGutters() * this.gutterSize;

        this.displayedAreas.forEach(area => {
          area.component.setStyleFlex(
            0,
            0,
            `calc( ${area.size}% - ${((area.size as number) / 100) * sumGutterSize}px )`,
            area.minSize !== null && area.minSize === area.size ? true : false,
            area.maxSize !== null && area.maxSize === area.size ? true : false
          );
        });
      }
    }
    ///////////////////////////////////////////
    // PIXEL MODE
    else if (this.unit === 'pixel') {
      this.displayedAreas.forEach(area => {
        // Area with wildcard size
        if (area.size === null) {
          if (this.displayedAreas.length === 1) {
            area.component.setStyleFlex(1, 1, `100%`, false, false);
          } else {
            area.component.setStyleFlex(1, 1, `auto`, false, false);
          }
        }
        // Area with pixel size
        else {
          // Only one area > flex-basis 100%
          if (this.displayedAreas.length === 1) {
            area.component.setStyleFlex(0, 0, `100%`, false, false);
          }
          // Multiple areas > use each pixel basis
          else {
            area.component.setStyleFlex(
              0,
              0,
              `${area.size}px`,
              area.minSize !== null && area.minSize === area.size ? true : false,
              area.maxSize !== null && area.maxSize === area.size ? true : false
            );
          }
        }
      });
    }
  }

  _clickTimeout: number | null = null;

  public clickGutter(event: MouseEvent | TouchEvent, gutterNum: number): void {
    const tempPoint = getPointFromEvent(event) as MtxSplitPoint;

    // Be sure mouseup/touchend happened at same point as mousedown/touchstart to trigger click/dblclick
    if (this.startPoint && this.startPoint.x === tempPoint.x && this.startPoint.y === tempPoint.y) {
      // If timeout in progress and new click > clearTimeout & dblClickEvent
      if (this._clickTimeout !== null) {
        window.clearTimeout(this._clickTimeout);
        this._clickTimeout = null;
        this.notify('dblclick', gutterNum);
        this.stopDragging();
      }
      // Else start timeout to call clickEvent at end
      else {
        this._clickTimeout = window.setTimeout(() => {
          this._clickTimeout = null;
          this.notify('click', gutterNum);
          this.stopDragging();
        }, this.gutterDblClickDuration);
      }
    }
  }

  public startDragging(
    event: MouseEvent | TouchEvent,
    gutterOrder: number,
    gutterNum: number
  ): void {
    event.preventDefault();
    event.stopPropagation();

    this.startPoint = getPointFromEvent(event);
    if (this.startPoint === null || this.disabled === true) {
      return;
    }

    this.snapshot = {
      gutterNum,
      lastSteppedOffset: 0,
      allAreasSizePixel:
        getElementPixelSize(this.elRef, this.direction) - this.getNbGutters() * this.gutterSize,
      allInvolvedAreasSizePercent: 100,
      areasBeforeGutter: [],
      areasAfterGutter: [],
    };

    this.displayedAreas.forEach(area => {
      const areaSnapshot: MtxSplitAreaSnapshot = {
        area,
        sizePixelAtStart: getElementPixelSize(area.component.elRef, this.direction),
        sizePercentAtStart: (this.unit === 'percent' ? area.size : -1) as number, // If pixel mode, anyway, will not be used.
      };

      if (area.order < gutterOrder) {
        if (this.restrictMove === true) {
          (this.snapshot as MtxSplitSnapshot).areasBeforeGutter = [areaSnapshot];
        } else {
          (this.snapshot as MtxSplitSnapshot).areasBeforeGutter.unshift(areaSnapshot);
        }
      } else if (area.order > gutterOrder) {
        if (this.restrictMove === true) {
          if ((this.snapshot as MtxSplitSnapshot).areasAfterGutter.length === 0) {
            (this.snapshot as MtxSplitSnapshot).areasAfterGutter = [areaSnapshot];
          }
        } else {
          (this.snapshot as MtxSplitSnapshot).areasAfterGutter.push(areaSnapshot);
        }
      }
    });

    this.snapshot.allInvolvedAreasSizePercent = [
      ...this.snapshot.areasBeforeGutter,
      ...this.snapshot.areasAfterGutter,
    ].reduce((t, a) => t + a.sizePercentAtStart, 0);

    if (
      this.snapshot.areasBeforeGutter.length === 0 ||
      this.snapshot.areasAfterGutter.length === 0
    ) {
      return;
    }

    this.dragListeners.push(
      this.renderer.listen('document', 'mouseup', this.stopDragging.bind(this))
    );
    this.dragListeners.push(
      this.renderer.listen('document', 'touchend', this.stopDragging.bind(this))
    );
    this.dragListeners.push(
      this.renderer.listen('document', 'touchcancel', this.stopDragging.bind(this))
    );

    this.ngZone.runOutsideAngular(() => {
      this.dragListeners.push(
        this.renderer.listen('document', 'mousemove', this.dragEvent.bind(this))
      );
      this.dragListeners.push(
        this.renderer.listen('document', 'touchmove', this.dragEvent.bind(this))
      );
    });

    this.displayedAreas.forEach(area => area.component.lockEvents());

    this.isDragging = true;
    this.renderer.addClass(this.elRef.nativeElement, 'mtx-dragging');
    this.renderer.addClass(
      this.gutterEls.toArray()[this.snapshot.gutterNum - 1].nativeElement,
      'mtx-dragged'
    );

    this.notify('start', this.snapshot.gutterNum);
  }

  private dragEvent(event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (this._clickTimeout !== null) {
      window.clearTimeout(this._clickTimeout);
      this._clickTimeout = null;
    }

    if (this.isDragging === false) {
      return;
    }

    this.endPoint = getPointFromEvent(event);
    if (this.endPoint === null) {
      return;
    }

    // Calculate steppedOffset

    let offset =
      this.direction === 'horizontal'
        ? (this.startPoint as MtxSplitPoint).x - this.endPoint.x
        : (this.startPoint as MtxSplitPoint).y - this.endPoint.y;
    if (this.dir === 'rtl') {
      offset = -offset;
    }
    const steppedOffset = Math.round(offset / this.gutterStep) * this.gutterStep;

    if (steppedOffset === (this.snapshot as MtxSplitSnapshot).lastSteppedOffset) {
      return;
    }

    (this.snapshot as MtxSplitSnapshot).lastSteppedOffset = steppedOffset;

    // Need to know if each gutter side areas could reacts to steppedOffset

    let areasBefore = getGutterSideAbsorptionCapacity(
      this.unit,
      (this.snapshot as MtxSplitSnapshot).areasBeforeGutter,
      -steppedOffset,
      (this.snapshot as MtxSplitSnapshot).allAreasSizePixel
    );
    let areasAfter = getGutterSideAbsorptionCapacity(
      this.unit,
      (this.snapshot as MtxSplitSnapshot).areasAfterGutter,
      steppedOffset,
      (this.snapshot as MtxSplitSnapshot).allAreasSizePixel
    );

    // Each gutter side areas can't absorb all offset
    if (areasBefore.remain !== 0 && areasAfter.remain !== 0) {
      if (Math.abs(areasBefore.remain) === Math.abs(areasAfter.remain)) {
        /** */
      } else if (Math.abs(areasBefore.remain) > Math.abs(areasAfter.remain)) {
        areasAfter = getGutterSideAbsorptionCapacity(
          this.unit,
          (this.snapshot as MtxSplitSnapshot).areasAfterGutter,
          steppedOffset + areasBefore.remain,
          (this.snapshot as MtxSplitSnapshot).allAreasSizePixel
        );
      } else {
        areasBefore = getGutterSideAbsorptionCapacity(
          this.unit,
          (this.snapshot as MtxSplitSnapshot).areasBeforeGutter,
          -(steppedOffset - areasAfter.remain),
          (this.snapshot as MtxSplitSnapshot).allAreasSizePixel
        );
      }
    }
    // Areas before gutter can't absorbs all offset > need to recalculate sizes for areas after gutter.
    else if (areasBefore.remain !== 0) {
      areasAfter = getGutterSideAbsorptionCapacity(
        this.unit,
        (this.snapshot as MtxSplitSnapshot).areasAfterGutter,
        steppedOffset + areasBefore.remain,
        (this.snapshot as MtxSplitSnapshot).allAreasSizePixel
      );
    }
    // Areas after gutter can't absorbs all offset > need to recalculate sizes for areas before gutter.
    else if (areasAfter.remain !== 0) {
      areasBefore = getGutterSideAbsorptionCapacity(
        this.unit,
        (this.snapshot as MtxSplitSnapshot).areasBeforeGutter,
        -(steppedOffset - areasAfter.remain),
        (this.snapshot as MtxSplitSnapshot).allAreasSizePixel
      );
    }

    if (this.unit === 'percent') {
      // Hack because of browser messing up with sizes using calc(X% - Ypx) -> el.getBoundingClientRect()
      // If not there, playing with gutters makes total going down to 99.99875% then 99.99286%, 99.98986%,..
      const all = [...areasBefore.list, ...areasAfter.list];
      const areaToReset = all.find(
        a =>
          a.percentAfterAbsorption !== 0 &&
          a.percentAfterAbsorption !== a.areaSnapshot.area.minSize &&
          a.percentAfterAbsorption !== a.areaSnapshot.area.maxSize
      );

      if (areaToReset) {
        areaToReset.percentAfterAbsorption =
          (this.snapshot as MtxSplitSnapshot).allInvolvedAreasSizePercent -
          all
            .filter(a => a !== areaToReset)
            .reduce((total, a) => total + a.percentAfterAbsorption, 0);
      }
    }

    // Now we know areas could absorb steppedOffset, time to really update sizes

    areasBefore.list.forEach(item => updateAreaSize(this.unit, item));
    areasAfter.list.forEach(item => updateAreaSize(this.unit, item));

    this.refreshStyleSizes();
    this.notify('progress', (this.snapshot as MtxSplitSnapshot).gutterNum);
  }

  private stopDragging(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.isDragging === false) {
      return;
    }

    this.displayedAreas.forEach(area => area.component.unlockEvents());

    while (this.dragListeners.length > 0) {
      const fct = this.dragListeners.pop();
      if (fct) {
        fct();
      }
    }

    // Warning: Have to be before "notify('end')"
    // because "notify('end')"" can be linked to "[size]='x'" > "build()" > "stopDragging()"
    this.isDragging = false;

    // If moved from starting point, notify end
    if (
      this.endPoint &&
      ((this.startPoint as MtxSplitPoint).x !== this.endPoint.x ||
        (this.startPoint as MtxSplitPoint).y !== this.endPoint.y)
    ) {
      this.notify('end', (this.snapshot as MtxSplitSnapshot).gutterNum);
    }

    this.renderer.removeClass(this.elRef.nativeElement, 'mtx-dragging');
    this.renderer.removeClass(
      this.gutterEls.toArray()[(this.snapshot as MtxSplitSnapshot).gutterNum - 1].nativeElement,
      'mtx-dragged'
    );
    this.snapshot = null;

    // Needed to let (click)="clickGutter(...)" event run and verify if mouse moved or not
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.startPoint = null;
        this.endPoint = null;
      });
    });
  }

  public notify(
    type: 'start' | 'progress' | 'end' | 'click' | 'dblclick' | 'transitionEnd',
    gutterNum: number
  ): void {
    const sizes = this.getVisibleAreaSizes();

    if (type === 'start') {
      this.dragStart.emit({ gutterNum, sizes });
    } else if (type === 'end') {
      this.dragEnd.emit({ gutterNum, sizes });
    } else if (type === 'click') {
      this.gutterClick.emit({ gutterNum, sizes });
    } else if (type === 'dblclick') {
      this.gutterDblClick.emit({ gutterNum, sizes });
    } else if (type === 'transitionEnd') {
      if (this.transitionEndSubscriber) {
        this.ngZone.run(() => this.transitionEndSubscriber.next(sizes));
      }
    } else if (type === 'progress') {
      // Stay outside zone to allow users do what they want about change detection mechanism.
      this.dragProgressSubject.next({ gutterNum, sizes });
    }
  }

  public ngOnDestroy(): void {
    this.stopDragging();
  }
}
