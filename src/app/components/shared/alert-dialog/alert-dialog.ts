import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-dialog',
  imports: [CommonModule],
  templateUrl: './alert-dialog.html',
  styleUrl: './alert-dialog.css',
})
export class AlertDialogComponent {
  @Input() isOpen = false;
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() title = '';
  @Input() message = '';
  @Input() buttonText = 'Aceptar';

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
