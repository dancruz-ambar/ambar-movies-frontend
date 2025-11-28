export interface MovieCard {
  _id: string;
  title: string;
  image: string;
  description: string;
  rating: number;
  year: number;
  genre: string;
  director: string;
  duration: number;
  releaseDate: Date;
}

export interface createMovieSchema {
  title: string;
  image: string;
  description: string;
  rating: number;
  year: number;
  genre: string;
  director: string;
  duration: number;
  releaseDate: Date;
}
