import { OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import * as fromService from '../../shared/index';

@Component({
  selector: 'app-spinner',
  template: `<ng-template #progressSpinnerRef>
    <mat-progress-spinner
      [color]="color"
      [diameter]="diameter"
      [mode]="mode!"
      [strokeWidth]="strokeWidth"
      [value]="value"
    >
    </mat-progress-spinner>
  </ng-template>`,
})
export class AppSpinnerComponent implements OnInit {
  @Input() color?: any;
  @Input() diameter?: number = 75;
  @Input() mode?: ProgressSpinnerMode;
  @Input() strokeWidth?: number;
  @Input() value?: number;
  @Input() backdropEnabled = true;
  @Input() positionGloballyCenter = true;
  @Input() displayProgressSpinner?: boolean;

  @ViewChild('progressSpinnerRef', { static: true })
  private progressSpinnerRef?: TemplateRef<any>;
  private progressSpinnerOverlayConfig?: OverlayConfig;
  private overlayRef?: OverlayRef;
  constructor(
    private vcRef: ViewContainerRef,
    private overlayService: fromService.AppOverlayService
  ) {}
  ngOnInit() {
    // Config for Overlay Service
    this.progressSpinnerOverlayConfig = {
      hasBackdrop: this.backdropEnabled,
    };
    if (this.positionGloballyCenter) {
      this.progressSpinnerOverlayConfig['positionStrategy'] =
        this.overlayService.positionGloballyCenter();
    }
    // Create Overlay for progress spinner
    this.overlayRef = this.overlayService.createOverlay(
      this.progressSpinnerOverlayConfig
    );
  }
  ngOnChanges() {
    // Based on status of displayProgressSpinner attach/detach overlay to progress spinner template
    if (this.overlayRef) {
      if (this.displayProgressSpinner && !this.overlayRef.hasAttached()) {
        this.overlayService.attachTemplatePortal(
          this.overlayRef,
          this.progressSpinnerRef!,
          this.vcRef
        );
      } else if (
        !this.displayProgressSpinner &&
        this.overlayRef.hasAttached()
      ) {
        this.overlayRef.detach();
      }
    }
  }
}
