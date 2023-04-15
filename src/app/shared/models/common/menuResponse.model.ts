export interface MenuResponse {
  route: string;
  name: string;
  type: 'link' | 'sub' | 'extLink' | 'extTabLink';
  icon: string;
  children?: MenuResponse[];
}

export interface QuickMenuResponse {
  name: string;
  quickmenuroute: string;
  icon: string;
  type: 'link' | 'sub' | 'extLink' | 'extTabLink';
}
