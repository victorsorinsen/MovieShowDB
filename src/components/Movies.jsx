import React from 'react';
import MostPopular from './Movies/MostPopular';
import TopRated from './Movies/TopRated';
import Upcoming from './Movies/Upcoming';
import Background from './background';
import MovieCarousel from './Movies/MovieCarousel';

const Movies = () => {
  return (
    <>
      <Background />
      <MovieCarousel />
      {/* <Slider /> */}
      <MostPopular />
      <TopRated />
      <Upcoming />
    </>
  );
};

export default Movies;
