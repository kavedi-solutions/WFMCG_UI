import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { PreloaderService, SpinnerService } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'FMCG-Kavedi Solutions';

  constructor(
    private preloader: PreloaderService,
    private spinnerService: SpinnerService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.preloader.hide();
    this.spinnerService.httpProgress().subscribe((status: boolean) => {
      if (status) {
        this.renderer.addClass(document.body, 'cursor-loader');
      } else {
        this.renderer.removeClass(document.body, 'cursor-loader');
      }
    });
  }
}
