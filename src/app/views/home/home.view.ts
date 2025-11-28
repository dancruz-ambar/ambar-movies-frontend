import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { MovieCard } from '@interfaces/components/movie-card/movie-card.interface';
import { MovieCardComponent } from '@components/movie-card/movie-card';
import { ModalComponent } from '@components/shared/modal/modal';
import { MovieFormComponent } from '@components/movie-form/movie-form';
import { MovieDetailsComponent } from '@components/movie-details/movie-details';
import { MovieService } from 'src/app/services/movie.service';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from '@components/shared/confirm-dialog/confirm-dialog';
import { AlertDialogComponent } from '@components/shared/alert-dialog/alert-dialog';
import { Alert } from '@interfaces/components/alert/alert.interface';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MovieCardComponent,
    ConfirmDialogComponent,
    ModalComponent,
    MovieFormComponent,
    MovieDetailsComponent,
    AlertDialogComponent,
  ],
  templateUrl: './home.view.html',
  styleUrl: './home.view.css',
})
export class HomeView implements OnInit {
  @ViewChild(MovieFormComponent) movieFormComponent!: MovieFormComponent;

  public isModalOpen: boolean = false;
  public isMovieDetailsOpen: boolean = false;
  private _movies: MovieCard[] = [];
  public selectedMovie: MovieCard | null = null;
  public searchTerm: string = '';

  get movies() {
    if (!this.searchTerm.trim()) {
      return this._movies;
    }
    const term = this.searchTerm.toLowerCase();
    return this._movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(term) ||
        movie.director?.toLowerCase().includes(term) ||
        movie.genre?.toLowerCase().includes(term)
    );
  }

  private _controls = {
    isConfirmDialogOpen: false,
    showAlert: false,
    alert: {
      title: '',
      message: '',
      type: 'success' as Alert['type'],
      buttonText: 'Aceptar',
    },
  };

  get controls() {
    return this._controls;
  }

  constructor(private cdr: ChangeDetectorRef, private movieService: MovieService) {}

  ngOnInit() {
    this._fetchAllMovies();
  }

  private async _fetchAllMovies() {
    try {
      const response = await firstValueFrom(this.movieService.getAll());
      this._movies = response.data;

      this.cdr.detectChanges();
    } catch (error: any) {
      this._movies = [];
      this.cdr.detectChanges();
    }
  }

  private _showAlert(title: string, message: string, type: Alert['type'] = 'success') {
    this._controls.showAlert = true;
    this._controls.alert = { title, message, type, buttonText: 'Aceptar' };
    this._controls.isConfirmDialogOpen = false;
  }

  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  addMovie() {
    this.selectedMovie = null;
    this.movieFormComponent.movieForm.reset();
    this.movieFormComponent.imagePreview =
      'https://drive-in-theatre.netlify.app/movieImages/default-movie.png';
    this.toggleModal();
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  selectMovie(movie: MovieCard) {
    this.selectedMovie = movie;
    this.toggleMovieDetails();
  }

  handleDeleteMovie(movie: MovieCard) {
    this._controls.isConfirmDialogOpen = true;
    this.selectedMovie = movie;
  }

  handleConfirmDelete() {
    this._deleteMovie();
  }

  private async _deleteMovie() {
    try {
      await firstValueFrom(this.movieService.delete(this.selectedMovie!._id));
      this._showAlert('¡Éxito!', 'La película se ha eliminado correctamente');
      this.refreshMovies();
      this.cdr.detectChanges();
    } catch (error: any) {
      this._showAlert('Error al eliminar la película', error.message, 'error');
      this.cdr.detectChanges();
    }
  }

  editMovie(movie: MovieCard) {
    this.selectedMovie = movie;
    this.toggleModal();
  }

  toggleMovieDetails() {
    this.isMovieDetailsOpen = !this.isMovieDetailsOpen;
  }

  sortMovies(event: Event) {
    const sort = (event.target as HTMLSelectElement).value;

    switch (sort) {
      case 'title':
        this._movies = this._movies.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'duration':
        this._movies = this._movies.sort((a, b) => a.duration - b.duration);
        break;
      case 'rating':
        this._movies = this._movies.sort((a, b) => b.rating - a.rating);
        break;
      case 'releaseDate':
        this._movies = this._movies.sort(
          (a, b) => a.releaseDate.getTime() - b.releaseDate.getTime()
        );
        break;
    }
  }

  addMovieSuccess() {
    this._showAlert('¡Éxito!', 'La película se ha agregado correctamente');
    this.movieFormComponent.closeForm();
    this.refreshMovies();
  }

  updateSuccess() {
    this._showAlert('¡Éxito!', 'La película se ha actualizado correctamente');
    this.refreshMovies();
  }

  refreshMovies() {
    this._fetchAllMovies();
  }

  handleCancelDelete() {
    this.selectedMovie = null;
    this._controls.isConfirmDialogOpen = false;
    this.cdr.detectChanges();
  }
}
