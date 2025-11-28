import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createMovieSchema, MovieCard } from '@interfaces/components/movie-card/movie-card.interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<{ data: MovieCard[] }> {
    return this.http.get<{ data: MovieCard[]}>(`${this.baseUrl}/movies`)
  }

  create(movie: createMovieSchema): Observable<{ data: MovieCard, message: string }> {
    return this.http.post<{ data: MovieCard, message: string}>(`${this.baseUrl}/movie`, movie);
  }

  update(id: string, movie: MovieCard): Observable<{ data: MovieCard, message: string }> {
    return this.http.put<{ data: MovieCard, message: string}>(`${this.baseUrl}/movies/${id}`, movie);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string}>(`${this.baseUrl}/movies/${id}`);
  }

}
