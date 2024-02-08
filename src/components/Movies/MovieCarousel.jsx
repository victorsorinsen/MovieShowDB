import { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { Link } from 'react-router-dom';

function MovieCarousel() {
  const [movieTitle, setMovieTitle] = useState('');
  const [carouselItems, setCarouselItems] = useState([]);

  const getDataFromServer = function () {
    fetch(
      'https://api.themoviedb.org/3/trending/movie/day?api_key=6a77f5a2cdf1a150f808f73c35533a92'
    )
      .then((r) => r.json())
      .then((data) => {
        const items = data.results.slice(0, 10).map((result, index) => {
          return {
            movieTitle: result.title,
            moviePoster:
              'https://www.themoviedb.org/t/p/original' + result.backdrop_path,
            movieOverview: result.overview,
            movieId: result.id,
          };
        });
        setCarouselItems(items);
      });
  };

  useEffect(() => {
    getDataFromServer();
  }, []);

  return (
    <>
      <Carousel
        data-bs-theme="dark"
        prevIcon={<MdChevronLeft size={40} className="slider-icon left" />}
        nextIcon={<MdChevronRight size={40} className="slider-icon right" />}
      >
        {carouselItems.map((item, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={item.moviePoster}
              alt="First slide"
            />
            <Carousel.Caption>
              <Link
                className="carouselMovieTitle"
                to={`/movies/${item.movieId}`}
              >
                <h5>{item.movieTitle}</h5>
              </Link>
              {/* <p className="carouseldescrip">{item.movieOverview}</p> */}
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
}

export default MovieCarousel;
