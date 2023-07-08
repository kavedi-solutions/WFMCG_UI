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
      <span
        class="f-s-20 f-w-500 matero-branding-name"
        style="font-style: oblique;text-decoration: underline;"
        >Kavedi Solutions</span
      >
    </div>
  `,
})
export class BrandingComponent {}
