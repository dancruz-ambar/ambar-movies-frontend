export interface Alert {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  buttonText: string;
}
