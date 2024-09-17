document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
  
    if (movieId) {
      fetchMovieDetail(movieId);
    }
  
    document.getElementById('back-button').addEventListener('click', () => {
      window.history.back(); // Menggunakan window.history.back() untuk kembali ke halaman sebelumnya
    });
  });
  
  function fetchMovieDetail(movieId) {
    const API_KEY = '3b91bc412620c3cc515a4a4666a9429b';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`;
  
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          document.getElementById('movie-title').textContent = data.title;
          document.getElementById('movie-tagline').textContent = data.tagline || 'No tagline available';
          document.getElementById('movie-release-date').textContent = `Release Date: ${data.release_date}`;
          document.getElementById('movie-genres').textContent = `Genres: ${data.genres.map(genre => genre.name).join(', ')}`;
          document.getElementById('movie-duration').textContent = `Duration: ${data.runtime} minutes`;
          document.getElementById('movie-original-language').textContent = `Original Language: ${data.original_language}`;
          document.getElementById('movie-vote-average').textContent = `Vote Average: ${data.vote_average}`;
          document.getElementById('movie-vote-count').textContent = `Vote Count: ${data.vote_count}`;
          document.getElementById('movie-overview').textContent = data.overview;
  
          const posterImg = document.getElementById('movie-poster');
          posterImg.src = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'placeholder.jpg'; // Menambahkan placeholder jika tidak ada poster
          posterImg.alt = `Poster of ${data.title}`;
        }
      })
      .catch(error => {
        console.error('Error fetching movie details:', error);
        // Optional: Menangani kesalahan, misalnya menampilkan pesan kesalahan di UI
      });
  }
  