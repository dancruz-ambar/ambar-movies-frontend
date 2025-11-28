import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MovieCard } from '@interfaces/components/movie-card/movie-card.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css',
})
export class MovieCardComponent {
  @Input() movie: MovieCard | null = null;
  @Output() movieSelected = new EventEmitter<void>();
  @Output() deleteMovie = new EventEmitter<void>();
  @Output() editMovie = new EventEmitter<void>();

  onMovieClick() {
    this.movieSelected.emit();
  }

  onDeleteMovie() {
    this.deleteMovie.emit();
  }

  onEditMovie() {
    this.editMovie.emit();
  }
}
