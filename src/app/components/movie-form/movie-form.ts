import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createMovieSchema, MovieCard } from '@interfaces/components/movie-card/movie-card.interface';
import { Alert } from '@interfaces/components/alert/alert.interface';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators as V,
  ReactiveFormsModule,
} from '@angular/forms';
import { MovieService } from 'src/app/services/movie.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-movie-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movie-form.html',
  styleUrl: './movie-form.css',
})
export class MovieFormComponent {
  @Input() set movie(movie: MovieCard | null) {
    if (movie) {
      this._movieData = movie;
      this.movieForm.patchValue({
        title: movie.title,
        releaseDate: new Date(movie.releaseDate).toISOString().split('T')[0],
        duration: movie.duration,
        genre: movie.genre,
        description: movie.description,
        director: movie.director,
        image: movie.image,
        rating: movie.rating
      });
      this.imagePreview = movie.image;
      this.isEditMode = true;
    }
  }

  private _movieData: MovieCard | null = null;

  private _controls = {
    displayAlert: false,
    alert: {
      title: '',
      message: '',
      type: 'success',
    },
  };

  get controls() {
    return this._controls;
  }

  public imagePreview: string = 'https://drive-in-theatre.netlify.app/movieImages/default-movie.png';
  public isEditMode: boolean = false;
  private readonly _movieForm: FormGroup;
  get movieForm() {
    return this._movieForm;
  }

  @Output() addMovie = new EventEmitter<void>();
  @Output() updateMovie = new EventEmitter<void>();
  @Output() closeMovieForm = new EventEmitter<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private movieService: MovieService
  ) {
    this._movieForm = this._buildMovieForm();
  }

  private _buildMovieForm() {
    return this.formBuilder.group({
      title: new FormControl('', [V.required]),
      releaseDate: new FormControl('', [V.required]),
      duration: new FormControl('', [V.required]),
      genre: new FormControl('', [V.required]),
      description: new FormControl('', [V.required]),
      director: new FormControl('', [V.required]),
      image: new FormControl(null, [V.required]),
      rating: new FormControl(0, [V.required, V.min(0), V.max(10)])
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(input.files[0]);
      this.movieForm.get('image')?.setValue(input.files[0]);
    }
  }

  async handleAddNewMovie() {
    if (this.movieForm.valid) {
      const movieData = this.movieForm.value as MovieCard;
      movieData.year = new Date(movieData.releaseDate).getFullYear();
      movieData.image = this.imagePreview;

      try {
        const response = await firstValueFrom(this.movieService.create(movieData));
        console.log('Movie created successfully', response);
        this.movieForm.reset();
        this.addMovie.emit();
      } catch (error: any) {
        console.error('Error creating movie', error);

        this.cdr.detectChanges();
      }
    }
  }

  async handleUpdateMovie() {
    if (this.movieForm.valid && this._movieData?._id) {
      const movieData: MovieCard = this.movieForm.value;
      movieData.year = new Date(movieData.releaseDate).getFullYear();
      movieData.image = this.imagePreview;


      try {
        const response = await firstValueFrom(this.movieService.update(this._movieData._id, movieData));
        this.updateMovie.emit();
      } catch (error: any) {
        console.error('Error updating movie', error);
      }
    }
  }

  closeForm() {
    this.isEditMode = false;
    this.movieForm.reset();
    this.imagePreview = 'https://drive-in-theatre.netlify.app/movieImages/default-movie.png';
    this.cdr.detectChanges();
    this.closeMovieForm.emit();
    console.log('Form closed', this.movie)

  }
}
