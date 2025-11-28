import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class ModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Agregar pelicula';
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
