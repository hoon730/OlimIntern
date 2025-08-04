import axios from "axios";
const API_KEY = "46d1f10a8f0adcef07e6187ff984064a";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface Movie {
  id: number;
  backdrop_path: string;
  genre_ids: number[];
  poster_path: string;
  title: string;
  original_title: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  adult: boolean;
}

export interface GetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const getMovies = () => {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=us-en`
  ).then((response) => response.json());
};

export const getMovies2 = async () => {
  const response = await axios.get(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=us-en`
  );
  return response.data;
};

export const searchContents = (keyword: string | null) => {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
};

export const searchGeneres = () => {
  return fetch(`${BASE_PATH}/genre/movie/list?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
};

export const getReviews = (movieId: number) => {
  return fetch(`${BASE_PATH}/movie/${movieId}/reviews?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
};

export const getVideos = (movieId: number) => {
  return fetch(`${BASE_PATH}/movie/${movieId}/videos?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
};
