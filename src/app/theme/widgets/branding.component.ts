import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <div class="matero-branding" href="/">
      <img
        src="./assets/defaultImages/quickMenu.png"
        class="matero-branding-logo-expanded"
        alt="logo"
      />
      <span class="matero-branding-name">Kavedi Solutions</span>
    </div>
  `,
})
export class BrandingComponent {}
