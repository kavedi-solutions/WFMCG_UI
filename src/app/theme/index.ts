import { HeaderComponent } from "./header/header.component";
import { QuickmenubarComponent } from "./quickmenubar/quickmenubar.component";
import { SidemenuComponent } from "./sidemenu/sidemenu.component";
import { BrandingComponent } from "./widgets/branding.component";
import { UserComponent } from "./widgets/user.component";

export const ThemesComponent: any[] = [
  HeaderComponent,
  QuickmenubarComponent,
  BrandingComponent,
  SidemenuComponent,
  UserComponent
]

export * from "./header/header.component";
export * from "./quickmenubar/quickmenubar.component";
export * from "./sidemenu/sidemenu.component";
export * from "./widgets/user.component";
export * from "./widgets/branding.component";
