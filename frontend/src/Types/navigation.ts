export interface NavItem {
  name: string;
  path: string;
}

export const NAV_LIST: NavItem[] = [
  { name: '홈', path: '/' },
  { name: '환경설정', path: '/Settings' },
  { name: 'TTS', path: '/TTS' },
  { name: 'FontSize', path: '/FontSize' },
  { name: 'Admin', path: '/Admin' },
];