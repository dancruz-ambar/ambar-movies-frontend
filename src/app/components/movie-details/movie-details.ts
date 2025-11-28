import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCard } from '@interfaces/components/movie-card/movie-card.interface';

@Component({
  selector: 'app-movie-details',
  imports: [CommonModule],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetailsComponent {
  @Input() movie: MovieCard | null = null;

}
