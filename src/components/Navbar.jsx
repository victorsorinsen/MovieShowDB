import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loggedin from './Loggedin';
import Button from 'react-bootstrap/Button';
import { BiSolidMoviePlay } from 'react-icons/bi';
import Menu from './Menu';
import Form from 'react-bootstrap/Form';
import { useNavigate, useLocation } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { movieGenreArray } from './exportFunctions';
import { FaStar } from 'react-icons/fa';

const Navbar = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const [dropDownTitle, setDropdownTitle] = useState('All');
  const [focusedButton, setFocusedButton] = useState(false);
  const [cardItems, setCardItems] = useState([]);
  const [currentURL, setCurrentURL] = useState(window.location.href);
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleClick = () => {
    navigate(`/SearchResults/${dropDownTitle}/${keyword}`);
  };

  const EnterKey = (event) => {
    if (event.key === 'Enter') {
      handleClick();
    }
  };

  const HomePage = () => {
    window.location.href = '/';
  };

  const clickButton = (title) => {
    setDropdownTitle(title);
  };

  const handleFocusButton = () => {
    setFocusedButton(true);
  };

  const handleInputBlur = () => {
    setFocusedButton(false);
  };

  useEffect(() => {
    const getSearchResults = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?query=${keyword}&include_adult=false&language=en-US&page=1&api_key=6a77f5a2cdf1a150f808f73c35533a92`
        );
        const data = await response.json();
        const items = data.results.slice(0, 10).map((result, index) => {
          if (
            selectedCategory === 'All' ||
            (selectedCategory === 'Movies' && result.media_type === 'movie') ||
            (selectedCategory === 'TV Shows' && result.media_type === 'tv') ||
            (selectedCategory === 'People' && result.media_type === 'person')
          ) {
            return {
              title: result.title,
              name: result.name,
              poster_path:
                'https://www.themoviedb.org/t/p/original' + result.poster_path,
              vote_average: result.vote_average,
              id: result.id,
              backdrop_path:
                'https://www.themoviedb.org/t/p/original' +
                result.backdrop_path,
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
          } else {
            return null;
          }
        });
        const filteredItems = items.filter((item) => item !== null);
        setCardItems(filteredItems);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    getSearchResults();

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setCardItems([]);
      }
    });

    return () => {
      window.removeEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          setCardItems([]);
        }
      });
    };
  }, [keyword, selectedCategory]);

  const handleInputClick = () => {
    const inputElement = document.getElementById('inputScale');
    if (inputElement) {
      inputElement.select();
    }
  };

  useEffect(() => {
    const handleURLChange = () => {
      console.log('Current URL:', location.pathname);
      const inputElement = document.getElementById('inputScale');
      if (inputElement) {
        inputElement.value = '';
      }
      setKeyword('');
      setCardItems([]);
    };

    handleURLChange();

    window.addEventListener('popstate', handleURLChange);

    return () => {
      window.removeEventListener('popstate', handleURLChange);
    };
  }, [location.pathname]);

  return (
    <>
      <div className="navbar">
        <div>
          <Menu />
          <BiSolidMoviePlay className="pageicon" size={40} onClick={HomePage} />
          <span className="pageicon" onClick={HomePage}>
            <b>My Watchlist</b>
          </span>
        </div>
        <div className="searchbar">
          <Form.Control
            type="text"
            id="inputScale"
            placeholder="Search..."
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDownCapture={EnterKey}
            onFocus={handleFocusButton}
            onBlur={handleInputBlur}
            onClick={handleInputClick}
          />
          {cardItems.length > 0 && (
            <div className="searchResultsDrop">
              {cardItems.map((item, index) => (
                <Link
                  to={
                    item.mediaType === 'movie'
                      ? `/movies/${item.id}`
                      : item.mediaType === 'tv'
                      ? `/tv/${item.id}`
                      : item.mediaType === 'person'
                      ? `/person/${item.id}`
                      : '/'
                  }
                  key={index}
                >
                  {item.mediaType === 'movie' || item.mediaType === 'tv' ? (
                    <div className="searchItemDiv">
                      <div>
                        {item.poster_path.endsWith(null) ? (
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
                      <div className="searchDetailsDiv">
                        <p>
                          {item.mediaType === 'movie' ? (
                            <b>{item.title}</b>
                          ) : (
                            <b>{item.name}</b>
                          )}
                        </p>
                        {item.mediaType === 'movie' ? (
                          <p className="smallerText">{item.release_date}</p>
                        ) : (
                          <p className="smallerText">{item.first_air_date}</p>
                        )}
                        <p className="smallerText" key={index}>
                          <FaStar className="starrating" size={20} />
                          {item.vote_average !== undefined
                            ? parseFloat(item.vote_average.toFixed(1))
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="searchItemDiv">
                      <div>
                        {item.profile_path.endsWith(null) ? (
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
                      <div className="searchDetailsDiv">
                        <p>
                          <b>{item.name}</b>
                        </p>
                        <p className="smallerText" key={index}>
                          {item.job}
                        </p>
                      </div>
                    </div>
                  )}
                </Link>
              ))}
              <Link to={`/SearchResults/${dropDownTitle}/${keyword}`}>
                <div className="searchResultsAll">
                  See all results for "{keyword}"
                </div>
              </Link>
            </div>
          )}
          <DropdownButton
            id="dropdown-basic-button"
            className={focusedButton ? 'focused' : ''}
            title={dropDownTitle}
          >
            <Dropdown.Item
              onClick={() => {
                clickButton('All');
                setSelectedCategory('All');
              }}
            >
              All
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                clickButton('Movies');
                setSelectedCategory('Movies');
              }}
            >
              Movies
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                clickButton('TV Shows');
                setSelectedCategory('TV Shows');
              }}
            >
              TV Shows
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                clickButton('People');
                setSelectedCategory('People');
              }}
            >
              People
            </Dropdown.Item>
          </DropdownButton>
          <Button
            className="buton searchbutton"
            onClick={handleClick}
            variant="primary"
          >
            <b>Search</b>
          </Button>{' '}
        </div>
        <Loggedin className="loginbutton" />
      </div>
    </>
  );
};

export default Navbar;
