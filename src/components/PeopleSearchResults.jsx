import React from 'react';
import { Link } from 'react-router-dom';
// import Background from '../background';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

  const navigate = useNavigate();

  useEffect(() => {
    const getSearchResults = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/person?query=${keyword}&include_adult=false&language=en-US&page=1&api_key=6a77f5a2cdf1a150f808f73c35533a92`
        );
        const data = await response.json();
        const items = data.results.map((result, index) => {
          return {
            name: result.name,
            profile_path:
              'https://www.themoviedb.org/t/p/original' + result.profile_path,
            id: result.id,
            job: result.known_for_department,
            known_for: result.known_for,
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
        `https://api.themoviedb.org/3/search/person?query=${keyword}&include_adult=false&language=en-US&page=${i}&api_key=6a77f5a2cdf1a150f808f73c35533a92`
      );
      const data = await response.json();
      const newItems = data.results.map((result, index) => {
        return {
          name: result.name,
          profile_path:
            'https://www.themoviedb.org/t/p/original' + result.profile_path,
          id: result.id,
          job: result.known_for_department,
          known_for: result.known_for,
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
        defaultActiveKey="People"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="People" title="People">
          {cardItems.length > 0 && (
            <div className="resultsTabDiv">
              {cardItems.map((item, index) => (
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
