export interface MenuResponse {
  route: string;
  name: string;
  type: 'link' | 'sub' | 'extLink' | 'extTabLink';
  icon: string;
  children?: MenuResponse[];
}
