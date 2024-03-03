const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const favoriteContainer = document.getElementById('favorite-container');
let favoriteArr = [];
// Function to load favorite movies from localStorage
function loadFavorites() {
    const favorites = localStorage.getItem('favoriteArr');
    return favorites ? JSON.parse(favorites) : [];
}

// Load existing favorites when the page loads
favoriteArr = loadFavorites();
async function loadMovies(searchTerm) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=9d5b69f2`);
    if (!response.ok) {
      throw new Error('Network response was not okay.');
    }

    const data = await response.json();
    displayMovieList(data.Search);
  } catch (error) {
    console.error(error);
  }
}

function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove('hide-search-list');
    loadMovies(searchTerm);
  } else {
    searchList.classList.add('hide-search-list');
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = " ";
  for (let i = 0; i < movies.length; i++) {

    let movieListItem = document.createElement('div');
    movieListItem.classList.add('search-list-item');
    let favoriteButton = document.createElement('button');
    favoriteButton.id = 'star';
    favoriteButton.innerHTML = `<div><i class="fa-solid fa-star"></i></div>`;
    favoriteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const imdbID = movies[i].imdbID;
        addToFavorite(imdbID);
      // Check if the movie is already in favorites
      
    });
    movieListItem.addEventListener('click', () => {
      window.location.href = `MoviePage.html?movieID=${movies[i].imdbID}`;
    });
    if (movies[i].Poster !== "N/A") {
      var moviePoster = movies[i].Poster;
    }
    movieListItem.innerHTML = `
      <div class="search-item-thumbnail">
        <img src="${moviePoster}">
      </div>
      <div class="search-item-info">
        <h3>${movies[i].Title}</h3>
        <p>${movies[i].Year}</p>
      </div>
    `;
    movieListItem.appendChild(favoriteButton);
    searchList.appendChild(movieListItem);
  }
}

async function loadMoviesDetails(movieID) {
    console.log(movieID)
  const result = await fetch(`https://www.omdbapi.com/?i=${movieID}&apikey=9d5b69f2`);
  const movieDetails = await result.json();
  return movieDetails;
}

function displayMovieDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieID = urlParams.get('movieID');

  loadMoviesDetails(movieID)
    .then(movieDetails => {
      resultGrid.innerHTML = `
        <div class="movie-poster">
          <img src="${movieDetails.Poster}">
        </div>
        <div class="movie-info">
          <h3 class="movie-title">${movieDetails.Title}</h3>
          <ul class="movie-misc-info">
            <li class="year"><b>Year: </b>${movieDetails.Year}</li>
            <li class="rated"><b>Rated: </b>${movieDetails.Rated}</li>
            <li class="released"><b>Release: </b>${movieDetails.Released}</li>
          </ul>
          <p class="genre"><b>Genre: </b>${movieDetails.Genre}</p>
          <p class="writer"><b>Writer: </b>${movieDetails.Writer}</p>
          <p class="actors"><b>Actors: </b>${movieDetails.Actors}</p>
          <p class="plot"><b>Plot: </b>${movieDetails.Plot}</p>
          <p class="language"><b>Language: </b>${movieDetails.Language}</p>
          <p class="awards"><b>Awards: </b>${movieDetails.Awards}</p>
        </div>`;
    })
    .catch(error => {
      console.error(error);
    });
}

function saveFavorites() {
  localStorage.setItem('favoriteArr', JSON.stringify(favoriteArr));
}



function displayFavorites() {
  const favorites = loadFavorites();
  const favoriteContainer = document.getElementById('favorite-container');

  favorites.forEach(movieID => {
    
    loadMoviesDetails(movieID)
    .then(movieDetails => {
        let movieContainer=document.createElement('li');
        movieContainer.classList.add('movie-container')
        movieContainer.innerHTML=`
        <div class="movie-poster">
          <img src="${movieDetails.Poster}">
        </div>
        
        <div class="movie-info">
        <h3 class="movie-title" id="remove-fav" onclick="removeFromFavorite('${movieDetails.imdbID}', this)"><i class="fa-solid fa-star"></i></h3>
          <h3 class="movie-title">${movieDetails.Title}</h3>
          <ul class="movie-misc-info">
            <li class="year"><b>Year: </b>${movieDetails.Year}</li>
            <li class="rated"><b>Rated: </b>${movieDetails.Rated}</li>
            <li class="released"><b>Release: </b>${movieDetails.Released}</li>
          </ul>
        </div>`;
        favoriteContainer.appendChild(movieContainer);
        
    })
    .catch(error => {
      console.error(error);
    });
  });
}
function addToFavorite(imdbID)
{
    console.log(imdbID);
    const index = favoriteArr.indexOf(imdbID);
      if (index !== -1) {
          // Remove from favorites
          favoriteArr.splice(index, 1);
      } else {
          // Add to favorites
          favoriteArr.push(imdbID);
      }
}

function removeFromFavorite(imdbID, element)
{
    const index = favoriteArr.indexOf(imdbID);
      if (index !== -1) {
          // Remove from favorites
          favoriteArr.splice(index, 1);
      }
      element.closest('.movie-container').remove();
}

window.addEventListener('beforeunload', saveFavorites);
window.addEventListener('click', (event) => {
  const isSearchList = event.target.closest('.search-list-item') !== null;
  if (!isSearchList) {
    searchList.classList.add('hide-search-list');
  }
});


if (window.location.pathname.includes('favorites.html')) {
    displayFavorites();
}