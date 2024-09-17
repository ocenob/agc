document.addEventListener('DOMContentLoaded', () => {
  const tabs = {
    home: document.getElementById('home-tab'),
    genres: document.getElementById('genres-tab'),
    popular: document.getElementById('popular-tab'),
    nowPlaying: document.getElementById('now-playing-tab'),
    upcoming: document.getElementById('upcoming-tab'),
    topRated: document.getElementById('top-rated-tab')
  };
  const searchForm = document.getElementById('search-form');

  if (tabs.home) tabs.home.addEventListener('click', () => fetchMovies('popular'));
  if (tabs.genres) tabs.genres.addEventListener('click', () => fetchGenres());
  if (tabs.popular) tabs.popular.addEventListener('click', () => fetchMovies('popular'));
  if (tabs.nowPlaying) tabs.nowPlaying.addEventListener('click', () => fetchMovies('nowPlaying'));
  if (tabs.upcoming) tabs.upcoming.addEventListener('click', () => fetchMovies('upcoming'));
  if (tabs.topRated) tabs.topRated.addEventListener('click', () => fetchMovies('topRated'));

  if (searchForm) {
    searchForm.addEventListener('submit', event => {
      event.preventDefault();
      const query = document.getElementById('search-input').value;
      fetchMoviesBySearch(query);
    });
  }

  fetchMovies('popular');
});

const API_KEY = '3b91bc412620c3cc515a4a4666a9429b';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_ENDPOINTS = {
  popular: `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`,
  nowPlaying: `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`,
  upcoming: `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`,
  topRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
  genres: `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
};

async function fetchMovies(category, page = 1) {
  const url = `${API_ENDPOINTS[category]}&page=${page}`;
  showLoading(true);
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
    createPagination(data.total_pages, page, category);
  } catch (error) {
    console.error(`Error fetching ${category} movies:`, error);
  } finally {
    showLoading(false);
  }
}

async function fetchGenres() {
  showLoading(true);
  try {
    const response = await fetch(API_ENDPOINTS.genres);
    const data = await response.json();
    displayGenres(data.genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
  } finally {
    showLoading(false);
  }
}

async function fetchMoviesByGenre(genreId) {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US&page=1`;
  showLoading(true);
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
    createPagination(data.total_pages, 1, 'discover');
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
  } finally {
    showLoading(false);
  }
}

async function fetchMoviesBySearch(query) {
  const SEARCH_MOVIES_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`;
  showLoading(true);
  try {
    const response = await fetch(SEARCH_MOVIES_URL);
    const data = await response.json();
    displayMovies(data.results);
    document.querySelector('.pagination').innerHTML = '';
  } catch (error) {
    console.error('Error fetching search movies:', error);
  } finally {
    showLoading(false);
  }
}

function displayMovies(movies) {
  const movieList = document.getElementById('movie-list');
  if (!movieList) {
    console.error('Element with id "movie-list" not found');
    return;
  }
  movieList.innerHTML = '';
  movies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.className = 'col-md-3 mb-4';
    movieElement.innerHTML = `
      <div class="card movie-card">
        <a href="movie-detail.html?id=${movie.id}">
          <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'placeholder.jpg'}" class="card-img-top" alt="${movie.title}" />
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
          </div>
        </a>
      </div>
    `;
    movieList.appendChild(movieElement);
  });
}

function displayGenres(genres) {
  const genreList = document.createElement('div');
  genreList.id = 'genre-list';
  genreList.className = 'list-group';
  genreList.innerHTML = '<h2>Genres</h2>';
  genres.forEach(genre => {
    const genreElement = document.createElement('button');
    genreElement.textContent = genre.name;
    genreElement.className = 'list-group-item list-group-item-action';
    genreElement.addEventListener('click', () => fetchMoviesByGenre(genre.id));
    genreList.appendChild(genreElement);
  });
  const movieList = document.getElementById('movie-list');
  if (!movieList) {
    console.error('Element with id "movie-list" not found');
    return;
  }
  movieList.innerHTML = '';
  movieList.appendChild(genreList);
}

function createPagination(totalPages, currentPage = 1, category = 'popular') {
  const pagination = document.getElementById('pagination');
  if (!pagination) {
    console.error('Element with id "pagination" not found');
    return;
  }
  pagination.innerHTML = '';

  const createPageButton = (page, text, isCurrent = false) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = `btn btn-${isCurrent ? 'primary' : 'secondary'}`;
    button.addEventListener('click', () => fetchMovies(category, page));
    return button;
  };

  // Display previous button
  if (currentPage > 1) {
    pagination.appendChild(createPageButton(currentPage - 1, '< Prev'));
  }

  // Display page buttons
  for (let page = 1; page <= Math.min(totalPages, 5); page++) {
    pagination.appendChild(createPageButton(page, page, page === currentPage));
  }

  // Display next button
  if (currentPage < totalPages) {
    pagination.appendChild(createPageButton(currentPage + 1, 'Next >'));
  }
}

function showLoading(isLoading) {
  const loadingSpinner = document.getElementById('loading');
  if (loadingSpinner) {
    loadingSpinner.style.display = isLoading ? 'flex' : 'none';
  }
}
