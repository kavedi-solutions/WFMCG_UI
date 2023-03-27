import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService, PreloaderService, SpinnerService } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'FMCG-Kavedi Solutions';
  displayProgressSpinner?: boolean;
  constructor(
    private preloader: PreloaderService,
    private spinnerService: SpinnerService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.VerifyTokenExpired();
  }

  ngAfterViewInit() {
    this.preloader.hide();
    this.spinnerService.httpProgress().subscribe((status: boolean) => {
      setTimeout(() => {
        this.displayProgressSpinner = status;
      }, 100);
    });
  }
}
