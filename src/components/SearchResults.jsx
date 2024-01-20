import React from 'react';
import { FaStar } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
// import Background from '../background';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { getAuth } from 'firebase/auth';
import { Tab, Tabs } from 'react-bootstrap';

const SearchResults = () => {
  const { keyword } = useParams();
  const [cardItems, setCardItems] = useState([]);
  let [addmore, setAddMore] = useState(1);
  const authContext = UserAuth();
  const [authenticated, setAuthenticated] = useState(false);
  const auth = getAuth();

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
            vote_average: result.vote_average,
            id: result.id,
            backdrop_path:
              'https://www.themoviedb.org/t/p/original' + result.backdrop_path,
            release_date: result.release_date,
            first_air_date: result.first_air_date,
            genres: result.genre_ids,
            overview: result.overview,
            popularity: result.popularity,
            mediaType: result.media_type,
            job: result.known_for_department,
            known_for: result.known_for,
            profile_path:
              'https://www.themoviedb.org/t/p/original' + result.profile_path,
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
          vote_average: result.vote_average,
          id: result.id,
          backdrop_path:
            'https://www.themoviedb.org/t/p/original' + result.backdrop_path,
          release_date: result.release_date,
          first_air_date: result.first_air_date,
          genres: result.genre_ids,
          overview: result.overview,
          popularity: result.popularity,
          job: result.known_for_department,
          mediaType: result.media_type,
          known_for: result.known_for,
          profile_path:
            'https://www.themoviedb.org/t/p/original' + result.profile_path,
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
    <>
      <div className="resultsContainer">
        <h2 className="resultsTitle">Search results for: "{keyword}"</h2>
        <Tabs
          defaultActiveKey="Movies"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          {cardItems.some((item) => item.mediaType === 'movie') && (
            <Tab eventKey="Movies" title="Movies">
              {cardItems.length > 0 && (
                <div className="resultsTabDiv">
                  {cardItems.map((item, index) =>
                    item.mediaType === 'movie' ? (
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
                            <Link to={`/movies/${item.id}`}>
                              <b>{item.title}</b>
                            </Link>
                          </div>
                          <p className="smallerText" key={index}>
                            <FaStar className="starrating" size={20} />
                            {item.vote_average !== undefined
                              ? parseFloat(item.vote_average.toFixed(1))
                              : 'N/A'}
                          </p>
                          <div>{item.release_date}</div>
                        </div>
                      </div>
                    ) : null
                  )}
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
          )}
          {cardItems.some((item) => item.mediaType === 'tv') && (
            <Tab eventKey="TV Shows" title="TV Shows">
              {cardItems.length > 0 && (
                <div className="creditsTabDiv">
                  {cardItems.map((item, index) =>
                    item.mediaType === 'tv' ? (
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
                            <Link to={`/movies/${item.id}`}>
                              <b>{item.name}</b>
                            </Link>
                          </div>
                          <p className="smallerText" key={index}>
                            <FaStar className="starrating" size={20} />
                            {item.vote_average !== undefined
                              ? parseFloat(item.vote_average.toFixed(1))
                              : 'N/A'}
                          </p>
                          <div>{item.first_air_date}</div>
                        </div>
                      </div>
                    ) : null
                  )}
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
          )}
          {cardItems.some((item) => item.mediaType === 'person') && (
            <Tab eventKey="People" title="People">
              {cardItems.length > 0 && (
                <div className="creditsTabDiv">
                  {cardItems.map((item, index) =>
                    item.mediaType === 'person' ? (
                      <div className="creditItemDiv" key={index}>
                        <div className="creditImage">
                          {item.profile_path.endsWith('null') ? (
                            <img
                              src="/src/assets/No-Image-Placeholder.png"
                              alt=""
                              className="searchImage"
                            />
                          ) : (
                            <img
                              src={item.profile_path}
                              alt=""
                              className="searchImage"
                            />
                          )}
                        </div>
                        <div className="creditDetailsDiv">
                          <div className="titleDate">
                            <Link to={`/person/${item.id}`}>
                              <b>{item.name}</b>
                            </Link>
                          </div>
                          <p className="smallerText" key={index}>
                            {item.job}
                          </p>
                          {/* <div>{item.known_for[0]}</div> */}
                        </div>
                      </div>
                    ) : null
                  )}
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
          )}
        </Tabs>
      </div>
    </>
  );
};

export default SearchResults;
