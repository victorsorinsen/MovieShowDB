import React from 'react';
import { useState, useEffect } from 'react';

const Background = () => {
  const [backdropArray, setBackDropArray] = useState([]);
  const [randomItemsArray, setRandomItemsArray] = useState([]);

  window.addEventListener('scroll', function () {
    var backgroundContainer = document.getElementById('background-container');
    var scrollPosition = window.scrollY;

    const navHeight = 50;

    backgroundContainer.style.position = 'fixed';
    if (scrollPosition <= 60) {
      backgroundContainer.style.top = `${navHeight - scrollPosition}px`;
    }
  });

  const numberOfItems = 36;

  // const getRandomItems = (array, count) => {
  //   const randomItems = [];
  //   const arrayCopy = [...array];

  //   for (let i = 0; i < count; i++) {
  //     const randomIndex = Math.floor(Math.random() * arrayCopy.length);
  //     const randomItem = arrayCopy.splice(randomIndex, 1)[0];
  //     randomItems.push(randomItem);
  //   }
  //   return randomItems;
  // };

  const getDataFromServer = async () => {
    const backdropArray = [];

    try {
      for (let i = 1; i <= 5; i++) {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${i}&api_key=6a77f5a2cdf1a150f808f73c35533a92`
        );

        const data = await response.json();

        if (data.results) {
          const backDrops = data.results.map((result, index) => ({
            movieBackdrop:
              'https://www.themoviedb.org/t/p/original' + result.backdrop_path,
          }));

          backdropArray.push(...backDrops);
        }
      }
      const getRandomItems = (array, count) => {
        const shuffledArray = array.sort(() => Math.random() - 0.5);
        return shuffledArray.slice(0, count);
      };
      setBackDropArray(backdropArray);
      setRandomItemsArray(getRandomItems(backdropArray, numberOfItems));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getDataFromServer();
  }, []);

  return (
    <>
      <div className="backgroundbody">
        <div className="background-container" id="background-container">
          {backdropArray.map((item, index) => (
            <img
              className="background-image"
              src={item.movieBackdrop}
              key={index}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Background;
