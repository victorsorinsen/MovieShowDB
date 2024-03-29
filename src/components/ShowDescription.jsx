import React from 'react';
import { FaStar } from 'react-icons/fa';
import { GoDotFill } from 'react-icons/go';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect, useRef } from 'react';
import { CiPlay1 } from 'react-icons/ci';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import Background from './background';
import { useParams } from 'react-router-dom';
import { addItemToWatchlist } from './exportFunctions';
import { useNavigate } from 'react-router-dom';
import {
  getDocs,
  collection,
  onSnapshot,
  setDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { UserAuth } from '../context/AuthContext';
import { getAuth } from 'firebase/auth';
import { TfiTrash } from 'react-icons/tfi';
import { deleteItemFromWatchlist } from './exportFunctions';
import Form from 'react-bootstrap/Form';

const ShowDescription = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState([]);
  const [cardItems, setCardItems] = useState([]);
  const authContext = UserAuth();
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const auth = getAuth();
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const handleCloseReview = () => setShowReview(false);
  const handleShowReview = () => setShowReview(true);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewDescription, setReviewDescription] = useState('');
  const [reviewRating, setReviewRating] = useState('');
  const [showApprovedReviews, setShowApprovedReviews] = useState([]);
  const reviewsDivRef = useRef(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=6a77f5a2cdf1a150f808f73c35533a92&append_to_response=videos,credits`
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
          `https://api.themoviedb.org/3/tv/${id}/similar?api_key=6a77f5a2cdf1a150f808f73c35533a92`
        );
        const data = await response.json();
        const items = data.results.map((result, index) => {
          return {
            name: result.name,
            poster_path:
              'https://www.themoviedb.org/t/p/original' + result.poster_path,
            vote_average: parseFloat(result.vote_average.toFixed(1)),
            id: result.id,
            backdrop_path:
              'https://www.themoviedb.org/t/p/original' + result.backdrop_path,
            first_air_date: result.first_air_date || 'Unreleased',
            genres: result.genre_ids,
            overview: result.overview,
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
    name,
    poster_path,
    backdrop_path,
    vote_average,
    overview,
    last_air_date,
    episode_run_time,
    genres,
    credits,
    videos,
    created_by,
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
      } else {
        console.log('User is not authenticated');
      }
    } catch (error) {
      console.error('Error fetching watchlist data from Firestore:', error);
    }
  };

  const isItemInWatchlist = (itemId) => {
    const isInWatchlist = watchlistItems.some((item) => item.id === itemId);
    return isInWatchlist;
  };

  const isItemInWatchlistthree = (name) => {
    const watchlistItem = watchlistItems.find((item) => item.name === name);

    if (watchlistItem) {
      return { isInWatchlist: true, docId: watchlistItem.docId };
    } else {
      return { isInWatchlist: false, docId: null };
    }
  };

  const { isInWatchlist, docId } = isItemInWatchlistthree(movieDetails.name);

  const addReview = async (id) => {
    await setDoc(doc(db, 'reviews', `${id} - ${auth.currentUser.uid}`), {
      title: reviewTitle,
      rating: reviewRating,
      description: reviewDescription,
      user:
        auth.currentUser.displayName !== null
          ? auth.currentUser.displayName
          : 'Anonymous',
      uid: auth.currentUser.uid,
      status: 'pending',
      date: new Date(),
      movieTitle: name,
      movieId: id,
    });
  };

  const getReviewsFromFirestore = async () => {
    try {
      const approvedReviews = [];
      const querySnapshot = await getDocs(collection(db, 'reviews'));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const reviews = data;

        if (approvedReviews) {
          approvedReviews.push(reviews);
        } else {
          console.log('Item is undefined');
        }
      });
      setShowApprovedReviews(approvedReviews);
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    }
  };

  const closeApprovedReviews = () => {
    setShowApprovedReviews([]);
  };

  return (
    <>
      {/* <Background /> */}
      <div className="descriptionPage">
        <div
          className="backdropImage"
          style={{
            backgroundImage: `url(https://www.themoviedb.org/t/p/original${backdrop_path})`,
          }}
        ></div>
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
              <h1>{name}</h1>
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
              {/* <GoDotFill className="movieDots" />
              <div className="movieRuntime">{episode_run_time} min</div> */}
              <GoDotFill className="movieDots" />
              <div className="movieYear">{last_air_date || 'Unreleased'}</div>
              <GoDotFill className="movieDots" />
              <div className="trailerDiv">
                <button className="trailer" onClick={() => setShow(true)}>
                  <CiPlay1 className="playIcon" />
                  <div className="trailerIconText">Trailer</div>
                </button>
              </div>
              <GoDotFill className="movieDots" />
              <div>
                <Button
                  className="userReviewsButon"
                  onClick={getReviewsFromFirestore}
                >
                  User Reviews
                </Button>
              </div>
              <GoDotFill className="movieDots" />
              <div>
                <Button
                  className="userReviewsButon"
                  onClick={() => {
                    if (authenticated) {
                      handleShowReview();
                    } else {
                      window.location.href = '/signin';
                    }
                  }}
                >
                  Add Review
                </Button>
              </div>
              <Modal
                show={showReview}
                onHide={handleCloseReview}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Add Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        autoFocus
                        onChange={(e) => setReviewTitle(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Label>Rating: </Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => setReviewRating(e.target.value)}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                    </Form.Select>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlTextarea1"
                    >
                      <Form.Label>Review description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        onChange={(e) => setReviewDescription(e.target.value)}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseReview}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      addReview(id);
                      handleCloseReview();
                    }}
                    className="reviewSubmit"
                  >
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>
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
                    <TfiTrash /> Remove from Watchlist
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
                    to={`/ShowGenre/${genre.id}/${encodeURIComponent(
                      genre.name
                    )}`}
                    key={index}
                  >
                    <Button className="genreButon" variant="primary">
                      {genre.name}
                    </Button>
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
                Created By:{' '}
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
      {showApprovedReviews.length > 0 && (
        <div className="reviewCardsDiv" ref={reviewsDivRef}>
          {showApprovedReviews.filter(
            (item) => item.status === 'approved' && item.movieId === id
          ).length > 0 ? (
            <>
              <h3>User Reviews:</h3>
              {showApprovedReviews
                .filter(
                  (item) => item.status === 'approved' && item.movieId === id
                )
                .map((item, index) => (
                  <Card className="reviewCard" key={index}>
                    <Card.Header as="h5">
                      {item.title}
                      <span className="nameAndDate">
                        {item.user}
                        {' - '}
                        {item.date &&
                          new Date(
                            item.date.seconds * 1000 +
                              Math.floor(item.date.nanoseconds / 1000000)
                          ).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                      </span>
                    </Card.Header>
                    <Card.Body>
                      <Card.Title className="">
                        <FaStar className="starrating" size={20} />
                        {item.rating}/10
                      </Card.Title>
                      <Card.Text>{item.description}</Card.Text>
                    </Card.Body>
                  </Card>
                ))}
            </>
          ) : (
            <h5 className="noReviews">
              <b>No reviews submitted.</b>
            </h5>
          )}
          <Button className="genreButon" onClick={closeApprovedReviews}>
            Close
          </Button>
        </div>
      )}
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
                <Link to={`/tv/${item.id}`}>
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
                  <Link className="cardMovieTitle" to={`/tv/${item.id}`}>
                    <b>{item.name}</b>
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
                          onClick={() => navigate('/Watchlist')}
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

export default ShowDescription;
