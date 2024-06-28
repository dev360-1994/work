export interface SearchBarModel {
  enabled: boolean;
  // items: Array<any>;
  filterBy: string;
  onSearch: (val: string) => any
  // nameKey: string;
  // url: string;
  placeholder: string;
  buttons?: {
    enabled: boolean;
    items: Array<{ icon: string, val: string, selected?: boolean }>,
    onClick: (val: string) => any
  }
}