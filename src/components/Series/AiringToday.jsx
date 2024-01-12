import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { addItemToWatchlist } from '../exportFunctions';
import { useNavigate } from 'react-router-dom';
import { getDocs, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { UserAuth } from '../../context/AuthContext';
import { getAuth } from 'firebase/auth';

function AiringToday() {
  const [cardItems, setCardItems] = useState([]);
  const authContext = UserAuth();
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const auth = getAuth();
  const [watchlistItems, setWatchlistItems] = useState([]);

  const slideLeftAiringToday = () => {
    const slider = document.getElementById('sliderAiringToday');
    const card = document.querySelector('.card');
    const computedStyle = window.getComputedStyle(card);
    const cardWidth = card.offsetWidth + parseFloat(computedStyle.marginRight);
    slider.scrollLeft -= cardWidth;
  };

  const slideRightAiringToday = () => {
    const slider = document.getElementById('sliderAiringToday');
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

  const getDataFromServer = function () {
    fetch(
      'https://api.themoviedb.org/3/tv/airing_today?api_key=6a77f5a2cdf1a150f808f73c35533a92'
    )
      .then((r) => r.json())
      .then((data) => {
        const items = data.results.map((result, index) => {
          return {
            name: result.name,
            poster_path:
              'https://www.themoviedb.org/t/p/original' + result.poster_path,
            vote_average: parseFloat(result.vote_average.toFixed(1)),
            id: result.id,
            backdrop_path:
              'https://www.themoviedb.org/t/p/original' + result.backdrop_path,
            first_air_date: result.first_air_date,
            genres: result.genre_ids,
            overview: result.overview,
            popularity: result.popularity,
          };
        });
        setCardItems(items);
      });
  };

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchData = async () => {
      await getWatchlistData();
      await getDataFromServer();
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

  return (
    <>
      <div className="sliderTitle">
        <h2>Airing Today</h2>
      </div>
      <div className="main-slider-container">
        <MdChevronLeft
          size={40}
          className="slider-icon left"
          onClick={slideLeftAiringToday}
        />
        <div className="cardz" id="sliderAiringToday">
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
          onClick={slideRightAiringToday}
        />
      </div>
    </>
  );
}

export default AiringToday;
