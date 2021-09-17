export interface FilterTimeConfig {
  min?: number;
  max?: number;
  step?: number;
  start?: number | Array<number>;
}

export type FilterModelNames =
  'search'
  | 'stars'
  | 'dynamicOption'
  | 'staticOption'
  | 'range'
  | 'flightDepartStops'
  | 'flightAirport'
  | 'time'
  | 'iconButton'
  | 'onlyProperty'
  | 'date'
  | 'medicalOptions';

export interface FilterModel {
  name: string;
  type: {
    name: FilterModelNames,
    icon?: string | Array<string>,
    badget?: boolean,
    staticValues?: Array<any>,
    staticWord?: Array<any>,
    staticDirection?: 'asc' | 'desc',
    class?: string,
    allRowDraweIconCount?: Array<any>,
  };
  displayName: string;
  displayCheck?: boolean;
  expanded?: boolean;
  hidden?: boolean;
}
