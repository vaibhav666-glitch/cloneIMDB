
const movieSearchBox=document.getElementById('movie-search-box')
const searchList=document.getElementById('search-list')
const resultGrid=document.getElementById('result-grid')
async function loadMovies(searchTerm){
    try{
        const response= await fetch(`http://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=9d5b69f2`);
              if(!response.ok)
        throw new Error('Network response was not okay.');
    
    const data=await response.json();
    displayMovieList(data.Search)
}
catch (error)
{console.error();}
}

function findMovies(){
    let searchTerm=(movieSearchBox.value).trim();
    if(searchTerm.length>0)
        {searchList.classList.remove('hide-search-list')
            loadMovies(searchTerm)
}
    else
        searchList.classList.add('hide-search-list')
}
function displayMovieList(movies)
{
    searchList.innerHTML=" "
    for(let i=0;i<movies.length;i++)
    {
        // let anchorTag=document.createElement('a');
        // anchorTag.href="MoviePage.html";
        let movieListItem=document.createElement('div');
        movieListItem.classList.add('search-list-item');  
        movieListItem.addEventListener('click', () => {
            window.location.href = `MoviePage.html?movieID=${movies[i].imdbID}`;
        });
        if(movies[i].Poster !== "N/A")
          var moviePoster =movies[i].Poster;
       movieListItem.innerHTML=`
       <div class="search-item-thumbnail">
       <img src="${moviePoster}">
     </div>
     <div class="search-item-info">
       <h3>${movies[i].Title}</h3>
       <p>${movies[i].Year}</p>
     </div>
       `
       //anchorTag.appendChild(movieListItem);
       searchList.appendChild(movieListItem);
    }
}

async function loadMoviesDetails(movieID) {
    const result = await fetch(`https://www.omdbapi.com/?i=${movieID}&apikey=9d5b69f2`);
    const movieDetails = await result.json();
    return movieDetails;
}

const urlParams = new URLSearchParams(window.location.search);
const movieID = urlParams.get('movieID');

// Call loadMoviesDetails with the movieID to fetch movie details
loadMoviesDetails(movieID)
    .then(movieDetails => {
        // Populate the result container on the result page with the movie details
        document.getElementById('result-grid').innerHTML = `
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