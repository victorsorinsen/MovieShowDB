import React from 'react';
import { UserAuth } from '../context/AuthContext';
import { Button } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { GoDotFill } from 'react-icons/go';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { TfiTrash } from 'react-icons/tfi';
import { movieGenreArray } from './exportFunctions';
import { showGenreArray } from './exportFunctions';
// import { deleteItemFromWatchlist } from './exportFunctions';
import { deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { BsArrowDown } from 'react-icons/bs';
import { BsArrowUp } from 'react-icons/bs';
import Badge from 'react-bootstrap/Badge';

const Watchlist = () => {
  const authContext = UserAuth();
  const [movieData, setMovieData] = useState([]);
  const [removeButtonPressed, setRemoveButtonPressed] = useState(false);
  const auth = getAuth();
  const [dropDownTitle, setDropdownTitle] = useState('Rating');
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [searchItem, setSearchItem] = useState('');
  const [filteredArray, setFilteredArray] = useState([]);

  const deleteItemFromWatchlist = async (docId) => {
    try {
      await deleteDoc(doc(db, auth.currentUser.uid, docId));
      setRemoveButtonPressed(true);
    } catch (error) {
      console.error('Error deleting item from watchlist:', error);
    }
  };

  const getDataFromFirestore = async (userId) => {
    try {
      const myData = [];

      const querySnapshot = await getDocs(collection(db, auth.currentUser.uid));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const movieData = data.item;

        if (movieData) {
          myData.push({ docId: doc.id, ...movieData });
        } else {
          console.log('Item is undefined');
        }
      });
      setMovieData(myData);
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    }
  };

  useEffect(() => {
    if (auth.currentUser || removeButtonPressed) {
      getDataFromFirestore(auth.currentUser.uid);
      setRemoveButtonPressed(false);
    }
  }, [auth.currentUser, removeButtonPressed]);

  const clickButton = (title) => {
    setDropdownTitle((prevTitle) => (prevTitle === title ? '' : title));
  };

  // const handleRadioChange = (e) => {
  //   setChecked1(e.currentTarget.checked);
  //   setChecked2(false);
  // };

  // const handleRadioChange2 = (e) => {
  //   setChecked2(e.currentTarget.checked);
  //   setChecked1(false);
  // };

  // const sortRatingAscending = (e) => {
  //   const ascendingArray = filteredArray.sort(
  //     (a, b) => a.vote_average - b.vote_average
  //   );
  //   console.log(filteredArray);
  //   setFilteredArray(ascendingArray);
  //   handleRadioChange2(e);
  // };

  // const sortRatingDescending = (e) => {
  //   const descendingArray = filteredArray.sort(
  //     (a, b) => b.vote_average - a.vote_average
  //   );
  //   console.log(filteredArray);
  //   setFilteredArray(descendingArray);
  //   handleRadioChange(e);
  // };

  const handleRadioChange = (e, descending, ratingType) => {
    if (!dropDownTitle) {
      console.log(0);
      return;
    }
    const sortedArray = filteredArray.slice();

    sortedArray.sort((a, b) => {
      let valueA, valueB;

      if (ratingType === 'vote_average') {
        valueA = b.vote_average;
        valueB = a.vote_average;
      } else if (ratingType === 'release_date') {
        valueA = new Date(b.release_date);
        valueB = new Date(a.release_date);
      } else if (ratingType === 'first_air_date') {
        valueA = new Date(b.first_air_date);
        valueB = new Date(a.first_air_date);
      } else if (ratingType === 'popularity') {
        valueA = b.popularity;
        valueB = a.popularity;
      }

      return descending ? valueB - valueA : valueA - valueB;
    });
    setFilteredArray(e.currentTarget.checked ? sortedArray : movieData);
    setChecked1(!descending && e.currentTarget.checked);
    setChecked2(descending && e.currentTarget.checked);
  };

  console.log(movieData);

  const searchFilter = () => {
    const filteredItems = movieData.filter((item) => {
      return (
        (item.title &&
          item.title
            .toString()
            .toLowerCase()
            .includes(searchItem.toLowerCase())) ||
        (item.name &&
          item.name.toString().toLowerCase().includes(searchItem.toLowerCase()))
      );
    });
    setFilteredArray(filteredItems);
  };

  useEffect(() => {
    searchFilter();
  }, [searchItem, movieData]);

  return (
    <div className="watchlistContainer">
      <h2>Watchlist</h2>
      <div className="watchlistFilters">
        <Form.Control
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchItem(e.target.value)}
        />
        <ButtonGroup>
          <DropdownButton
            id="dropdown-basic-button"
            title={`Filter by: ${dropDownTitle}`}
          >
            <Dropdown.Item
              onClick={() => clickButton('Rating')}
              // value="vote_average"
            >
              Rating
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => clickButton('Release Date')}
              value="release_date"
            >
              Release Date
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => clickButton('Popularity')}
              value="popularity"
            >
              Popularity
            </Dropdown.Item>
          </DropdownButton>
          <ButtonGroup className="mb-2 filterButton">
            <ToggleButton
              className="sortButtons one"
              id="toggle-check"
              type="checkbox"
              checked={checked2}
              value="1"
              onChange={(e) =>
                handleRadioChange(
                  e,
                  true,
                  dropDownTitle === 'Rating' ? 'vote_average' : 'popularity'
                )
              }
            >
              <BsArrowDown size={18} />
            </ToggleButton>
          </ButtonGroup>
          <ButtonGroup className="mb-2">
            <ToggleButton
              className="sortButtons"
              id="toggle-check2"
              type="checkbox"
              checked={checked1}
              value="2"
              onChange={(e) =>
                handleRadioChange(
                  e,
                  false,
                  dropDownTitle === 'Rating' ? 'vote_average' : 'popularity'
                )
              }
            >
              <BsArrowUp size={18} />
            </ToggleButton>
          </ButtonGroup>
        </ButtonGroup>
      </div>
      {movieData.length === 0 && (
        <div className="noMoviesDiv">No movies added in watchlist.</div>
      )}
      {filteredArray.length > 0 && (
        <Tabs
          defaultActiveKey="Movies"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="Movies" title="Movies">
            {filteredArray
              .filter((item) => item.title !== undefined)
              .map((movie, index) => (
                <div className="watchlistDescription" key={index}>
                  {movie.backdrop_path && (
                    <div
                      className="backdropImage"
                      style={{
                        backgroundImage: `url(https://www.themoviedb.org/t/p/original${movie.backdrop_path})`,
                      }}
                    ></div>
                  )}
                  <div className="generalWatchlistDescription">
                    <div className="imageDiv">
                      <Link to={`/movies/${movie.id}`}>
                        {movie.poster_path === null ? (
                          <img
                            className="descrWatchlistImage"
                            src="./src/assets/noimg.png"
                          />
                        ) : (
                          <img
                            className="descrWatchlistImage"
                            src={`https://www.themoviedb.org/t/p/original${movie.poster_path}`}
                          />
                        )}
                      </Link>
                    </div>
                    <div className="divWatchlistDescription">
                      <div>
                        <Link
                          className="cardMovieTitle"
                          to={`/movies/${movie.id}`}
                        >
                          <h1>{movie.title}</h1>
                        </Link>
                      </div>
                      <div className="watchlistMovieRatingYearRuntime">
                        <div className="movieRating">
                          <FaStar className="starrating" size={25} />
                          <span>
                            <b>
                              {movie.vote_average !== undefined
                                ? parseFloat(movie.vote_average.toFixed(1))
                                : 'N/A'}
                            </b>
                          </span>
                        </div>
                        <GoDotFill className="movieDots" />
                        <div>
                          <button
                            className="watchlistButton"
                            onClick={() => deleteItemFromWatchlist(movie.docId)}
                          >
                            <TfiTrash /> Remove
                          </button>
                        </div>
                      </div>
                      <div className="watchlistAirDate">
                        <p>{movie.release_date}</p>
                      </div>
                      <div className="movieWatchlistGenres">
                        {movie.genres && movie.genres.length > 0
                          ? movie.genres.some((item) =>
                              item.hasOwnProperty('name')
                            )
                            ? movie.genres.map((genre, index) => (
                                <Link
                                  to={`/MovieGenre/${
                                    genre.id
                                  }/${encodeURIComponent(genre.name)}`}
                                  key={index}
                                >
                                  <Button className="genreButon">
                                    {genre.name}
                                  </Button>
                                </Link>
                              ))
                            : movieGenreArray
                                .filter((genre) =>
                                  movie.genres.includes(genre.id)
                                )
                                .map((genre) => (
                                  <Link
                                    to={`/MovieGenre/${
                                      genre.id
                                    }/${encodeURIComponent(genre.name)}`}
                                    key={genre.id}
                                  >
                                    <Button className="genreButon">
                                      {genre.name}
                                    </Button>
                                  </Link>
                                ))
                          : null}
                      </div>
                      <div className="movieWatchlistOverview">
                        <p>{movie.overview}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </Tab>
          <Tab eventKey="TV Shows" title="TV Shows">
            {filteredArray
              .filter((item) => item.name !== undefined)
              .map((show, index) => (
                <div className="watchlistDescription" key={index}>
                  {show.backdrop_path && (
                    <div
                      className="backdropImage"
                      style={{
                        backgroundImage: `url(https://www.themoviedb.org/t/p/original${show.backdrop_path})`,
                      }}
                    ></div>
                  )}
                  <div className="generalWatchlistDescription">
                    <div className="imageDiv">
                      <Link to={`/tv/${show.id}`}>
                        {show.poster_path === null ? (
                          <img
                            className="descrWatchlistImage"
                            src="./src/assets/noimg.png"
                          />
                        ) : (
                          <img
                            className="descrWatchlistImage"
                            src={`https://www.themoviedb.org/t/p/original${show.poster_path}`}
                          />
                        )}
                      </Link>
                    </div>
                    <div className="divWatchlistDescription">
                      <div>
                        <Link className="cardMovieTitle" to={`/tv/${show.id}`}>
                          <h1>{show.name}</h1>
                        </Link>
                      </div>
                      <div className="watchlistMovieRatingYearRuntime">
                        <div className="movieRating">
                          <FaStar className="starrating" size={25} />
                          <span>
                            <b>
                              {show.vote_average !== undefined
                                ? parseFloat(show.vote_average.toFixed(1))
                                : 'N/A'}
                            </b>
                          </span>
                        </div>
                        <GoDotFill className="movieDots" />
                        <div>
                          <button
                            className="watchlistButton"
                            onClick={() => deleteItemFromWatchlist(show.docId)}
                          >
                            <TfiTrash /> Remove
                          </button>
                        </div>
                      </div>
                      <div className="watchlistAirDate">
                        <p>{show.first_air_date}</p>
                      </div>
                      <div className="movieWatchlistGenres">
                        {show.genres && show.genres.length > 0
                          ? show.genres.some((item) =>
                              item.hasOwnProperty('name')
                            )
                            ? show.genres.map((genre, index) => (
                                <Link
                                  to={`/ShowGenre/${
                                    genre.id
                                  }/${encodeURIComponent(genre.name)}`}
                                  key={index}
                                >
                                  <Button className="genreButon">
                                    {genre.name}
                                  </Button>
                                </Link>
                              ))
                            : showGenreArray
                                .filter((genre) =>
                                  show.genres.includes(genre.id)
                                )
                                .map((genre) => (
                                  <Link
                                    to={`/ShowGenre/${
                                      genre.id
                                    }/${encodeURIComponent(genre.name)}`}
                                    key={genre.id}
                                  >
                                    <Button className="genreButon">
                                      {genre.name}
                                    </Button>
                                  </Link>
                                ))
                          : null}
                      </div>
                      <div className="movieWatchlistOverview">
                        <p>{show.overview}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </Tab>
        </Tabs>
      )}
    </div>
  );
};

export default Watchlist;
