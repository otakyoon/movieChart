import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MovieRanker.css';

const MovieRanker = () => {
  const [movies, setMovies] = useState([]);
  const [leftMovie, setLeftMovie] = useState(null);
  const [rightMovie, setRightMovie] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [choicesCount, setChoicesCount] = useState(0);

  useEffect(() => {
    const fetchRandomMovies = async () => {
      try {
        const response = await axios.get('http://www.omdbapi.com/', {
          params: {
            apikey: 'b545d6b8',
            s: 'movie', // Vous pouvez utiliser un mot-clé ou un genre ici
            type: 'movie',
            page: Math.floor(Math.random() * 10) + 1 // Choisir une page aléatoire pour plus de diversité
          },
        });

        if (response.data.Search) {
          setMovies(response.data.Search);
        } else {
          console.error('No movies found');
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchRandomMovies();
  }, [choicesCount]);

  useEffect(() => {
    if (movies.length > 0) {
      setLeftMovie(getRandomMovie());
      setRightMovie(getRandomMovie());
    }
  }, [movies]);

  const getRandomMovie = () => {
    const randomIndex = Math.floor(Math.random() * movies.length);
    return movies[randomIndex];
  };

  const handleChoice = (chosenMovie) => {
    if (!ranking.some(movie => movie.imdbID === chosenMovie.imdbID)) {
      const newRanking = [...ranking, chosenMovie];
      setRanking(newRanking);
      setChoicesCount(choicesCount + 1);
    }

    const otherMovie = leftMovie.imdbID === chosenMovie.imdbID ? rightMovie : leftMovie;
    const newMovies = movies.filter(movie => movie.imdbID !== otherMovie.imdbID);
    setMovies(newMovies);

    setLeftMovie(getRandomMovie());
    setRightMovie(getRandomMovie());
  };

  const handleSkip = () => {
    setLeftMovie(getRandomMovie());
    setRightMovie(getRandomMovie());
  };

  if (!leftMovie || !rightMovie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="movie-ranker">
      <div className="movie-container">
        <div className="movie-card" onClick={() => handleChoice(leftMovie)}>
          <h2>{leftMovie.Title}</h2>
          <img src={leftMovie.Poster} alt={leftMovie.Title} />
        </div>
        <button className="skip-button" onClick={handleSkip}>
          🚫 Je ne sais pas
        </button>
        <div className="movie-card" onClick={() => handleChoice(rightMovie)}>
          <h2>{rightMovie.Title}</h2>
          <img src={rightMovie.Poster} alt={rightMovie.Title} />
        </div>
      </div>
      <div className="ranking">
        <h3>Ranking:</h3>
        <ul>
          {ranking.map((movie, index) => (
            <li key={movie.imdbID}>{index + 1}. {movie.Title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MovieRanker;
