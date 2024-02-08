import React from 'react';
import AiringToday from './Series/AiringToday';
import TopRatedSeries from './Series/TopRatedSeries';
import PopularSeries from './Series/PopularSeries';
import Background from './background';
import ShowsCarousel from './Series/ShowsCarousel';

const Series = () => {
  return (
    <>
      {/* <Background /> */}
      <ShowsCarousel />
      <AiringToday />
      <PopularSeries />
      <TopRatedSeries />
    </>
  );
};

export default Series;
