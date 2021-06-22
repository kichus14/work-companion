export interface AppTheme {
  name: string;
  slug: string;
  type: string;
  color: string;
}

export const THEMES: AppTheme[] = [
  {name: 'Bootstrap', type: 'light', color: 'blue', slug: 'bootstrap4-light-blue'},
  {name: 'Bootstrap', type: 'dark', color: 'blue', slug: 'bootstrap4-dark-blue'},
  {name: 'Bootstrap', type: 'light', color: 'purple', slug: 'bootstrap4-light-purple'},
  {name: 'Bootstrap', type: 'dark', color: 'purple', slug: 'bootstrap4-dark-purple'},
  {name: 'Material Design', type: 'light', color: 'indigo', slug: 'md-light-indigo'},
  {name: 'Material Design', type: 'dark', color: 'indigo', slug: 'md-dark-indigo'},
  {name: 'Material Design', type: 'light', color: 'deep Purple', slug: 'md-light-deeppurple'},
  {name: 'Material Design', type: 'dark', color: 'deep Purple', slug: 'md-dark-deeppurple'},
  {name: 'Fluent UI', type: 'light', color: '', slug: 'fluent-light'},
  {name: 'Saga', type: 'light', color: 'blue', slug: 'saga-blue'},
  {name: 'Saga', type: 'light', color: 'green', slug: 'saga-green'},
  {name: 'Saga', type: 'light', color: 'orange', slug: 'saga-orange'},
  {name: 'Saga', type: 'light', color: 'purple', slug: 'saga-purple'},
  {name: 'Vela', type: 'dark', color: 'blue', slug: 'vela-blue'},
  {name: 'Vela', type: 'dark', color: 'green', slug: 'vela-green'},
  {name: 'Vela', type: 'dark', color: 'orange', slug: 'vela-orange'},
  {name: 'Vela', type: 'dark', color: 'purple', slug: 'vela-purple'},
  {name: 'Arya', type: 'dark', color: 'blue', slug: 'arya-blue'},
  {name: 'Arya', type: 'dark', color: 'green', slug: 'arya-green'},
  {name: 'Arya', type: 'dark', color: 'orange', slug: 'arya-orange'},
  {name: 'Arya', type: 'dark', color: 'purple', slug: 'arya-purple'},
];
