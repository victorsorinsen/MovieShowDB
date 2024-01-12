import React from 'react';
import { FaStar } from 'react-icons/fa';
import { GoDotFill } from 'react-icons/go';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import { CiPlay1 } from 'react-icons/ci';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import Background from './background';
import { useParams } from 'react-router-dom';

const PersonDescription = () => {
  const { id } = useParams();
  const [personDetails, setPersonDetails] = useState([]);
  const [cardItems, setCardItems] = useState([]);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${id}?api_key=6a77f5a2cdf1a150f808f73c35533a92&append_to_response=credits&language=en-US`
        );
        const data = await response.json();

        setPersonDetails(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    const getDataFromServer = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=6a77f5a2cdf1a150f808f73c35533a92`
        );
        const data = await response.json();
        const items = data.results.map((result, index) => {
          return {
            movieTitle: result.title,
            moviePoster:
              'https://www.themoviedb.org/t/p/original' + result.poster_path,
            movieRating: parseFloat(result.vote_average.toFixed(1)),
            movieId: result.id,
          };
        });
        setCardItems(items);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    getDataFromServer();
    fetchPersonDetails();
  }, [id]);

  const {
    also_known_as,
    biography,
    birthday,
    deathday,
    gender,
    known_for_department,
    name,
    profile_path,
    place_of_birth,
    credits,
  } = personDetails;

  console.log(credits);

  const getGenderLabel = (gender) => {
    switch (gender) {
      case 0:
        return 'Not specified';
      case 1:
        return 'Female';
      case 2:
        return 'Male';
      case 3:
        return 'Non-binary';
      default:
        return 'Unknown';
    }
  };

  const genderLabel = getGenderLabel(gender);

  const knownFor = {};

  const [show, setShow] = useState(false);

  const slideLeftMostPopular = () => {
    const slider = document.getElementById('sliderMostPopular');
    const card = document.querySelector('.card');
    const computedStyle = window.getComputedStyle(card);
    const cardWidth = card.offsetWidth + parseFloat(computedStyle.marginRight);
    slider.scrollLeft -= cardWidth;
  };

  const slideRightMostPopular = () => {
    const slider = document.getElementById('sliderMostPopular');
    const card = document.querySelector('.card');
    const computedStyle = window.getComputedStyle(card);
    const cardWidth = card.offsetWidth + parseFloat(computedStyle.marginRight);
    slider.scrollLeft += cardWidth;
  };

  return (
    <>
      {/* <Background /> */}
      {/* {movieDetails.map((item, index) => ( */}
      <div className={`persondescriptionPage`}>
        {/* {backdrop_path && (
          <div
            className="backdropImage"
            style={{
              backgroundImage: `url(https://www.themoviedb.org/t/p/original${backdrop_path})`,
            }}
          ></div>
        )} */}
        <div className="persongeneralDescription">
          <div className="persondivImage">
            <img
              className="persondescrImage"
              src={`https://www.themoviedb.org/t/p/original${profile_path}`}
            />
          </div>
          <div className="persondivDescription">
            <div>
              <h1>{name}</h1>
            </div>
            <div>
              <h5>
                <b>Personal details:</b>
              </h5>
            </div>

            <div className="personmovieCast">
              <GoDotFill className="personmovieDots" />
              <div className="personmovieYear">
                Famous For: {known_for_department}
              </div>
              <GoDotFill className="personmovieDots" />
              <p>
                <b>
                  Also Known As:{' '}
                  {also_known_as && also_known_as.length > 0
                    ? also_known_as.join(', ')
                    : 'N/A'}
                </b>
              </p>
            </div>

            <div className="personmovieRatingYearRuntime">
              <GoDotFill className="personmovieDots" />
              <div className="personmovieYear">Gender: {genderLabel}</div>
            </div>
            <div></div>
            <div className="personmovieGenres">
              <GoDotFill className="personmovieDots" />
              <div className="personmovieRating">
                <span>
                  <b>Born: {birthday}</b>
                </span>
              </div>
              <GoDotFill className="personmovieDots" />
              <div className="personmovieYear">
                Place of birth: {place_of_birth}
              </div>
            </div>
            {deathday && (
              <div className="personmovieRuntime">
                {' '}
                <GoDotFill className="personmovieDots" />
                <p> Died: {deathday}</p>
              </div>
            )}
            <div className="personmovieOverview">
              <h6>Biography</h6>
              <p>{biography}</p>
            </div>
          </div>
        </div>
      </div>
      {/* ))} */}
      <div className="sliderTitle">
        <h2>Recommended for you</h2>
      </div>
      <div className="main-slider-container">
        <MdChevronLeft
          size={40}
          className="slider-icon left"
          onClick={slideLeftMostPopular}
        />

        {/* <div className="cardz" id="sliderMostPopular">
          {cardItems.map((item, index) => (
            <Card key={index}>
              <div className="imageDiv">
                <Link to={`/movies/${item.movieId}`}>
                  <Card.Img variant="top" src={item.moviePoster} />
                </Link>
              </div>
              <Card.Body>
                <Card.Title>
                  <Link
                    className="cardMovieTitle"
                    to={`/movies/${item.movieId}`}
                  >
                    <b>{item.movieTitle}</b>
                  </Link>
                </Card.Title>
                <Card.Text>
                  <div className="cardDetails">
                    <div className="rating">
                      <FaStar className="starrating" size={25} />
                      <span>
                        <b>{item.movieRating}</b>
                      </span>
                    </div>
                    <div className="addWatchlist">
                      <Button
                        className="addWatchlistButton"
                        variant="primary"
                        title="Add to Watchlist"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>

        <MdChevronRight
          size={40}
          className="slider-icon right"
          onClick={slideRightMostPopular}
        /> */}
      </div>
    </>
  );
};

export default PersonDescription;
