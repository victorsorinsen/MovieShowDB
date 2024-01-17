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
import { addItemToWatchlist, handleRedirect } from './exportFunctions';
import { TfiTrash } from 'react-icons/tfi';
import { deleteItemFromWatchlist } from './exportFunctions';
import { useNavigate } from 'react-router-dom';
import { getDocs, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { UserAuth } from '../context/AuthContext';
import { getAuth } from 'firebase/auth';

const MovieDescription = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState([]);
  const [cardItems, setCardItems] = useState([]);
  const authContext = UserAuth();
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const auth = getAuth();
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=6a77f5a2cdf1a150f808f73c35533a92&append_to_response=videos,credits`
        );
        const data = await response.json();
        setMovieDetails(data);
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
            title: result.title,
            poster_path:
              'https://www.themoviedb.org/t/p/original' + result.poster_path,
            vote_average: parseFloat(result.vote_average.toFixed(1)),
            id: result.id,
            backdrop_path:
              'https://www.themoviedb.org/t/p/original' + result.backdrop_path,
            release_date: result.release_date || 'Unreleased',
            genres: result.genre_ids,
            overview: result.overview || 'The plot is unknown.',
            popularity: result.popularity,
          };
        });
        setCardItems(items);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    getDataFromServer();
    fetchMovieDetails();
  }, [id]);

  const {
    title,
    poster_path,
    vote_average,
    overview,
    release_date,
    runtime,
    genres,
    credits,
    videos,
    backdrop_path,
    popularity,
  } = movieDetails;

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

  useEffect(() => {
    if (authContext && authContext.user) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, [authContext]);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchData = async () => {
      await getWatchlistData();
    };

    fetchData();
    if (userId) {
      const unsubscribe = onSnapshot(collection(db, userId), () => {
        fetchData();
      });

      return () => {
        unsubscribe();
      };
    }
  }, [userId]);

  const getWatchlistData = async () => {
    try {
      const myData = [];

      if (userId) {
        const querySnapshot = await getDocs(collection(db, userId));
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const movieData = data.item;

          if (movieData) {
            myData.push({ docId: doc.id, ...movieData });
          } else {
            console.log('Item is undefined');
          }
        });
        setWatchlistItems(myData);
        console.log('Watchlist Data:', myData); // Log watchlist data
      } else {
        console.log('User is not authenticated');
      }
    } catch (error) {
      console.error('Error fetching watchlist data from Firestore:', error);
    }
  };

  const isItemInWatchlist = (itemId) => {
    const isInWatchlist = watchlistItems.some((item) => item.id === itemId);
    console.log('Is Item in Watchlist:', isInWatchlist);
    return isInWatchlist;
  };

  console.log(movieDetails);

  const isItemInWatchlistthree = (title) => {
    const watchlistItem = watchlistItems.find((item) => item.title === title);

    if (watchlistItem) {
      console.log('Item found in Watchlist:', watchlistItem);
      return { isInWatchlist: true, docId: watchlistItem.docId };
    } else {
      console.log('Item not in Watchlist');
      return { isInWatchlist: false, docId: null };
    }
  };

  const { isInWatchlist, docId } = isItemInWatchlistthree(movieDetails.title);

  return (
    <>
      {/* <Background /> */}
      {/* {movieDetails.map((item, index) => ( */}
      <div className={`descriptionPage`}>
        {backdrop_path && (
          <div
            className="backdropImage"
            style={{
              backgroundImage: `url(https://www.themoviedb.org/t/p/original${backdrop_path})`,
            }}
          ></div>
        )}
        <div className="generalDescription">
          <div className="divImage">
            {poster_path === null ? (
              <img
                className="descrImage"
                src="/src/assets/No-Image-Placeholder.png"
              />
            ) : (
              <img
                className="descrImage"
                src={`https://www.themoviedb.org/t/p/original${poster_path}`}
              />
            )}
          </div>
          <div className="divDescription">
            <div>
              <h1>{title}</h1>
            </div>
            <div className="movieRatingYearRuntime">
              <div className="movieRating">
                <FaStar className="starrating" size={25} />
                <span>
                  <b>
                    {vote_average !== undefined
                      ? parseFloat(vote_average.toFixed(1))
                      : 'N/A'}
                  </b>
                </span>
              </div>
              <GoDotFill className="movieDots" />
              <div className="movieRuntime">{runtime} min</div>
              <GoDotFill className="movieDots" />
              <div className="movieYear">{release_date || 'Unreleased'}</div>
              <GoDotFill className="movieDots" />
              <div className="trailerDiv">
                <button className="trailer" onClick={() => setShow(true)}>
                  <CiPlay1 className="playIcon" />
                  <div className="trailerIconText">Trailer</div>
                </button>
              </div>
              <GoDotFill className="movieDots" />
              <div>
                {!isInWatchlist ? (
                  <button
                    className="watchlistButton"
                    onClick={
                      authenticated
                        ? () => addItemToWatchlist(movieDetails)
                        : () => navigate('/signin')
                    }
                  >
                    Add to Watchlist
                  </button>
                ) : (
                  <button
                    className="watchlistButton"
                    onClick={() => deleteItemFromWatchlist(docId)}
                  >
                    <TfiTrash /> Remove
                  </button>
                )}
              </div>
              <Modal
                className="trailerModal"
                show={show}
                onHide={() => setShow(false)}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
                centered
              >
                <Modal.Body>
                  <iframe
                    className="trailerFrame"
                    src={`https://www.youtube.com/embed/${
                      videos && videos.results && videos.results.length > 0
                        ? videos.results.find(
                            (video) => video.type === 'Trailer'
                          )
                          ? videos.results.find(
                              (video) => video.type === 'Trailer'
                            ).key
                          : 'N/A'
                        : 'N/A'
                    }`}
                    frameborder="0"
                    allowFullScreen
                  ></iframe>
                </Modal.Body>
              </Modal>
            </div>
            <div className="movieGenres">
              {genres && genres.length > 0 ? (
                genres.map((genre, index) => (
                  <Link
                    to={`/MovieGenre/${genre.id}/${encodeURIComponent(
                      genre.name
                    )}`}
                    key={index}
                  >
                    <Button className="genreButon">{genre.name}</Button>
                  </Link>
                ))
              ) : (
                <div>No genres available</div>
              )}
            </div>
            <div className="movieOverview">
              <h6>Overview</h6>
              <p>
                {overview !== undefined && overview !== null && overview !== ''
                  ? overview
                  : 'The plot is unknown.'}
              </p>
            </div>
            {/* overview   */}
            <div className="movieCast">
              <p>
                Cast:{' '}
                {credits && credits.cast && credits.cast.length > 0
                  ? credits.cast.slice(0, 8).map((actor, index) => (
                      <React.Fragment key={index}>
                        <Link to={`/person/${actor.id}`}>{actor.name}</Link>
                        {index < 7 && ', '}{' '}
                      </React.Fragment>
                    ))
                  : 'N/A'}
              </p>
            </div>
            <div className="movieDirector">
              <p>
                Directed By:{' '}
                {credits && credits.crew && credits.crew.length > 0 ? (
                  credits.crew.find((member) => member.job === 'Director') ? (
                    <Link
                      to={`/person/${
                        credits.crew.find((member) => member.job === 'Director')
                          .id
                      }`}
                    >
                      {
                        credits.crew.find((member) => member.job === 'Director')
                          .name
                      }
                    </Link>
                  ) : (
                    'N/A'
                  )
                ) : (
                  'N/A'
                )}
              </p>
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

        <div className="cardz" id="sliderMostPopular">
          {cardItems.map((item, index) => (
            <Card key={index}>
              <div className="imageDiv">
                <Link to={`/movies/${item.id}`}>
                  {item.poster_path.endsWith(null) ? (
                    <Card.Img
                      variant="top"
                      src="/src/assets/No-Image-Placeholder.png"
                    />
                  ) : (
                    <Card.Img variant="top" src={item.poster_path} />
                  )}
                </Link>
              </div>
              <Card.Body>
                <Card.Title>
                  <Link className="cardMovieTitle" to={`/movies/${item.id}`}>
                    <b>{item.title}</b>
                  </Link>
                </Card.Title>
                <Card.Text>
                  <div className="cardDetails">
                    <div className="rating">
                      <FaStar className="starrating" size={25} />
                      <span>
                        <b>{item.vote_average}</b>
                      </span>
                    </div>
                    <div className="addWatchlist">
                      {!isItemInWatchlist(item.id) ? (
                        <Button
                          className="addWatchlistButton"
                          variant="primary"
                          title="Add to Watchlist"
                          onClick={() => {
                            if (authenticated) {
                              addItemToWatchlist(item);
                              // getWatchlistData();
                            } else {
                              window.location.href = '/signin';
                            }
                          }}
                        >
                          +
                        </Button>
                      ) : (
                        <Button
                          className="inWatchlist"
                          onClick={() => navigate('/Account')}
                        >
                          In Watchlist
                        </Button>
                      )}
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
        />
      </div>
    </>
  );
};

export default MovieDescription;
