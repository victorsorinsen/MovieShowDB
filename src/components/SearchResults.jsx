import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FaStar } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
// import Background from '../background';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { addItemToWatchlist } from './exportFunctions';
import { getDocs, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { UserAuth } from '../context/AuthContext';
import { getAuth } from 'firebase/auth';

const SearchResults = () => {
  const { keyword } = useParams();
  const [cardItems, setCardItems] = useState([]);
  let [addmore, setAddMore] = useState(1);
  const authContext = UserAuth();

  const [authenticated, setAuthenticated] = useState(false);
  const auth = getAuth();
  const [watchlistItems, setWatchlistItems] = useState([]);

  useEffect(() => {
    const getSearchResults = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?query=${keyword}&include_adult=false&language=en-US&page=1&api_key=6a77f5a2cdf1a150f808f73c35533a92`
        );
        const data = await response.json();
        const items = data.results.map((result, index) => {
          return {
            title: result.title,
            name: result.name,
            poster_path:
              'https://www.themoviedb.org/t/p/original' + result.poster_path,
            vote_average: parseFloat(result.vote_average.toFixed(1)),
            id: result.id,
            backdrop_path:
              'https://www.themoviedb.org/t/p/original' + result.backdrop_path,
            release_date: result.release_date,
            first_air_date: result.first_air_date,
            genres: result.genre_ids,
            overview: result.overview,
            popularity: result.popularity,
            mediaType: result.media_type,
          };
        });
        setCardItems(items);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    getSearchResults();
  }, [keyword]);

  const loadMore = async () => {
    const i = addmore + 1;
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${keyword}&include_adult=false&language=en-US&page=${i}&api_key=6a77f5a2cdf1a150f808f73c35533a92`
      );
      const data = await response.json();
      const newItems = data.results.map((result, index) => {
        return {
          title: result.title,
          name: result.name,
          poster_path:
            'https://www.themoviedb.org/t/p/original' + result.poster_path,
          vote_average: parseFloat(result.vote_average.toFixed(1)),
          id: result.id,
          backdrop_path:
            'https://www.themoviedb.org/t/p/original' + result.backdrop_path,
          release_date: result.release_date,
          first_air_date: result.first_air_date,
          genres: result.genre_ids,
          overview: result.overview,
          popularity: result.popularity,
        };
      });
      setCardItems((prevItems) => [...prevItems, ...newItems]);
      setAddMore(i);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
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
        console.log('Watchlist Data:', myData);
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
    <div>
      {/* <Background /> */}
      <h2 className="genreTitle">Results for: "{keyword}"</h2>
      <div className="genrecardz" id="sliderMostPopular">
        {cardItems.map((item, index) => (
          <Card className="genrecard" key={index}>
            <div className="imageDiv">
              {item.mediaType === 'movie' ? (
                <Link to={`/movies/${item.id}`}>
                  <Card.Img variant="top" src={item.poster_path} />
                </Link>
              ) : (
                <Link to={`/tv/${item.id}`}>
                  <Card.Img variant="top" src={item.poster_path} />
                </Link>
              )}
            </div>
            <Card.Body>
              <Card.Title>
                {item.mediaType === 'movie' ? (
                  <Link className="cardMovieTitle" to={`/movies/${item.id}`}>
                    <b>{item.title}</b>
                  </Link>
                ) : (
                  <Link className="cardMovieTitle" to={`/tv/${item.id}`}>
                    <b>{item.name}</b>
                  </Link>
                )}
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
      <div className="loadMore">
        <button
          className="buton signInButon btn btn-primary"
          onClick={loadMore}
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
