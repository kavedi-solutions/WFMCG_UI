import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MtxAlertComponent } from './alert/alert.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MtxCheckboxGroupComponent } from './checkbox-group/checkbox-group.component';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatCommonModule,
  MatNativeDateModule,
  NativeDateModule,
} from '@angular/material/core';
import {
  DatetimeAdapter,
  MTX_DATETIME_FORMATS,
  MTX_NATIVE_DATETIME_FORMATS,
  NativeDatetimeAdapter,
} from './core/datetime';
import { MtxToObservablePipe, MtxIsTemplateRefPipe } from './core/pipes';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ColorChromeModule } from 'ngx-color/chrome';
import {
  MtxColorpicker,
  MtxColorpickerContent,
  MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './colorpicker/colorpicker';
import { MtxColorpickerInput } from './colorpicker/colorpicker-input';
import {
  MtxColorpickerToggle,
  MtxColorpickerToggleIcon,
} from './colorpicker/colorpicker-toggle';

import { MatButtonLoadingDirective } from './button/button-loading.directive';
import { CdkColumnResize, CdkColumnResizeFlex } from './column-resize';
import {
  MtxCalendar,
  MtxCalendarBody,
  MtxClock,
  MtxTime,
  MtxTimeInput,
  MtxDatetimepicker,
  MtxDatetimepickerToggle,
  MtxDatetimepickerToggleIcon,
  MtxDatetimepickerInput,
  MtxDatetimepickerContent,
  MtxMonthView,
  MtxYearView,
  MtxMultiYearView,
  MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './datetimepicker';
import { MtxDialog } from './dialog/dialog';
import { MtxDialogComponent } from './dialog/dialog.component';
import { MtxDrawer } from './drawer/drawer';
import { MtxDrawerContainer } from './drawer/drawer-container';
import { MtxFormGroupComponent } from './form-group/form-group.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MtxLoaderComponent } from './loader/loader.component';
import {
  MtxPopoverTrigger,
  MTX_POPOVER_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './popover/popover-trigger';
import { MtxPopover } from './popover/popover';
import { MtxPopoverContent } from './popover/popover-content';
import { MtxPopoverTarget } from './popover/popover-target';
import { MtxProgressComponent } from './progress/progress.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MtxOptionComponent } from './select/option.component';
import { MtxSelectComponent } from './select/select.component';
import {
  MtxSelectOptgroupTemplateDirective,
  MtxSelectOptionTemplateDirective,
  MtxSelectLabelTemplateDirective,
  MtxSelectMultiLabelTemplateDirective,
  MtxSelectHeaderTemplateDirective,
  MtxSelectFooterTemplateDirective,
  MtxSelectNotFoundTemplateDirective,
  MtxSelectTypeToSearchTemplateDirective,
  MtxSelectLoadingTextTemplateDirective,
  MtxSelectTagTemplateDirective,
  MtxSelectLoadingSpinnerTemplateDirective,
} from './select/templates.directive';
import { MtxSlider } from './slider/slider';
import { MtxSplitPaneDirective } from './split/split-pane.directive';
import { MtxSplitComponent } from './split/split.component';
import { MtxText3dComponent } from './text3d/text3d.component';
import {
  MtxTooltip,
  MTX_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER,
  TooltipComponent,
} from './tooltip/tooltip';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MtxGridCellComponent } from './grid/cell.component';
import { MtxGridColumnMenuComponent } from './grid/column-menu.component';
import { MtxGridExpansionToggleDirective } from './grid/expansion-toggle.directive';
import {
  MtxGridComponent,
  MtxGridCellSelectionDirective,
} from './grid/grid.component';
import {
  MtxGridRowClassPipe,
  MtxGridColClassPipe,
  MtxGridCellActionTooltipPipe,
  MtxGridCellActionDisablePipe,
  MtxGridCellSummaryPipe,
} from './grid/grid.pipe';
import { MtxGridService } from './grid/grid.service';
import { MatColumnResize, MatColumnResizeFlex, MatColumnResizeOverlayHandle, MatResizable } from './grid/column-resize';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    MtxAlertComponent,
    MtxCheckboxGroupComponent,
    MtxToObservablePipe,
    MtxIsTemplateRefPipe,
    MtxColorpicker,
    MtxColorpickerContent,
    MtxColorpickerInput,
    MtxColorpickerToggle,
    MtxColorpickerToggleIcon,
    MatButtonLoadingDirective,
    CdkColumnResize,
    CdkColumnResizeFlex,
    MtxCalendar,
    MtxCalendarBody,
    MtxClock,
    MtxTime,
    MtxTimeInput,
    MtxDatetimepicker,
    MtxDatetimepickerToggle,
    MtxDatetimepickerToggleIcon,
    MtxDatetimepickerInput,
    MtxDatetimepickerContent,
    MtxMonthView,
    MtxYearView,
    MtxMultiYearView,
    MtxDialogComponent,
    MtxDrawerContainer,
    MtxFormGroupComponent,
    MtxLoaderComponent,
    MtxPopover,
    MtxPopoverTrigger,
    MtxPopoverTarget,
    MtxPopoverContent,
    MtxProgressComponent,
    MtxSelectComponent,
    MtxOptionComponent,
    MtxSelectOptgroupTemplateDirective,
    MtxSelectOptionTemplateDirective,
    MtxSelectLabelTemplateDirective,
    MtxSelectMultiLabelTemplateDirective,
    MtxSelectHeaderTemplateDirective,
    MtxSelectFooterTemplateDirective,
    MtxSelectNotFoundTemplateDirective,
    MtxSelectTypeToSearchTemplateDirective,
    MtxSelectLoadingTextTemplateDirective,
    MtxSelectTagTemplateDirective,
    MtxSelectLoadingSpinnerTemplateDirective,
    MtxSlider,
    MtxSplitComponent,
    MtxSplitPaneDirective,
    MtxText3dComponent,
    MtxTooltip,
    TooltipComponent,
    MtxGridComponent,
    MtxGridCellComponent,
    MtxGridColumnMenuComponent,
    MtxGridExpansionToggleDirective,
    MtxGridCellSelectionDirective,
    MtxGridRowClassPipe,
    MtxGridColClassPipe,
    MtxGridCellActionTooltipPipe,
    MtxGridCellActionDisablePipe,
    MtxGridCellSummaryPipe,
    MatColumnResizeOverlayHandle,
    MatColumnResize,
    MatColumnResizeFlex,
    MatResizable,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCommonModule,
    FormsModule,
    MatCheckboxModule,
    NativeDateModule,
    MatNativeDateModule,
    OverlayModule,
    A11yModule,
    PortalModule,
    ColorChromeModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatChipsModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule,
    DragDropModule,
    MatDialogModule
  ],
  exports: [
    MatCommonModule,
    MtxAlertComponent,
    MtxCheckboxGroupComponent,
    MtxToObservablePipe,
    MtxIsTemplateRefPipe,
    MtxColorpicker,
    MtxColorpickerContent,
    MtxColorpickerInput,
    MtxColorpickerToggle,
    MtxColorpickerToggleIcon,
    MatButtonLoadingDirective,
    CdkColumnResize,
    CdkColumnResizeFlex,
    MtxCalendar,
    MtxCalendarBody,
    MtxClock,
    MtxTime,
    MtxDatetimepicker,
    MtxDatetimepickerToggle,
    MtxDatetimepickerToggleIcon,
    MtxDatetimepickerInput,
    MtxDatetimepickerContent,
    MtxMonthView,
    MtxYearView,
    MtxMultiYearView,
    MtxDialogComponent,
    MtxDrawerContainer,
    MtxFormGroupComponent,
    MtxLoaderComponent,
    MtxPopover,
    MtxPopoverTrigger,
    MtxPopoverTarget,
    MtxPopoverContent,
    MtxProgressComponent,
    MtxSelectComponent,
    MtxOptionComponent,
    MtxSelectOptgroupTemplateDirective,
    MtxSelectOptionTemplateDirective,
    MtxSelectLabelTemplateDirective,
    MtxSelectMultiLabelTemplateDirective,
    MtxSelectHeaderTemplateDirective,
    MtxSelectFooterTemplateDirective,
    MtxSelectNotFoundTemplateDirective,
    MtxSelectTypeToSearchTemplateDirective,
    MtxSelectLoadingTextTemplateDirective,
    MtxSelectTagTemplateDirective,
    MtxSelectLoadingSpinnerTemplateDirective,
    MtxSlider,
    MtxSplitComponent,
    MtxSplitPaneDirective,
    MtxText3dComponent,
    MtxTooltip,
    TooltipComponent,
    CdkScrollableModule,
    MtxGridComponent,
    MtxGridCellComponent,
    MtxGridColumnMenuComponent,
    MtxGridExpansionToggleDirective,
    MtxGridCellSelectionDirective,
    MtxGridRowClassPipe,
    MtxGridColClassPipe,
    MtxGridCellActionTooltipPipe,
    MtxGridCellActionDisablePipe,
    MtxGridCellSummaryPipe,
    MatColumnResizeOverlayHandle,
    MatColumnResize,
    MatColumnResizeFlex,
    MatResizable,
  ],
  providers: [
    MTX_DATETIMEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
    MTX_COLORPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
    MTX_POPOVER_SCROLL_STRATEGY_FACTORY_PROVIDER,
    MTX_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER,
    MtxDialog,
    MtxDrawer,
    MtxGridService,
    {
      provide: DatetimeAdapter,
      useClass: NativeDatetimeAdapter,
    },
    { provide: MTX_DATETIME_FORMATS, useValue: MTX_NATIVE_DATETIME_FORMATS },
  ],
})
export class ExtensionsModule {}
