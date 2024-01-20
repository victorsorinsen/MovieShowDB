import React from 'react';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
// import Background from '../background';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDocs, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { UserAuth } from '../context/AuthContext';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Tab, Tabs } from 'react-bootstrap';

const SearchResults = () => {
  const { keyword } = useParams();
  const [cardItems, setCardItems] = useState([]);
  let [addmore, setAddMore] = useState(1);
  const authContext = UserAuth();
  const [authenticated, setAuthenticated] = useState(false);
  const auth = getAuth();
  const [watchlistItems, setWatchlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getSearchResults = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/tv?query=${keyword}&include_adult=false&language=en-US&page=1&api_key=6a77f5a2cdf1a150f808f73c35533a92`
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

    getSearchResults();
  }, [keyword]);

  const loadMore = async () => {
    const i = addmore + 1;
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/tv?query=${keyword}&include_adult=false&language=en-US&page=${i}&api_key=6a77f5a2cdf1a150f808f73c35533a92`
      );
      const data = await response.json();
      const newItems = data.results.map((result, index) => {
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

  return (
    <div className="resultsContainer">
      <h2 className="resultsTitle">Search results for: "{keyword}"</h2>
      <Tabs
        defaultActiveKey="TV Shows"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="TV Shows" title="TV Shows">
          {cardItems.length > 0 && (
            <div className="resultsTabDiv">
              {cardItems.map((item, index) => (
                <div className="creditItemDiv" key={index}>
                  <div className="creditImage">
                    {item.poster_path.endsWith('null') ? (
                      <img
                        src="/src/assets/No-Image-Placeholder.png"
                        alt=""
                        className="searchImage"
                      />
                    ) : (
                      <img
                        src={item.poster_path}
                        alt=""
                        className="searchImage"
                      />
                    )}
                  </div>
                  <div className="creditDetailsDiv">
                    <div className="titleDate">
                      <Link to={`/tv/${item.id}`}>
                        <b>{item.name}</b>
                      </Link>
                    </div>
                    <p className="smallerText" key={index}>
                      <FaStar className="starrating" size={20} />
                      {item.vote_average}
                    </p>
                    <div>{item.first_air_date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="loadMore">
            <button
              className="buton signInButon btn btn-primary"
              onClick={loadMore}
            >
              Load More
            </button>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default SearchResults;
