import { useState, useEffect } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { HiOutlineMenu } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { BiSolidMoviePlay } from 'react-icons/bi';

function Menu() {
  const [movieGenre, setMovieGenre] = useState([]);
  const [showGenre, setShowGenre] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const HomePage = () => {
    window.location.href = '../';
  };

  const getMovieGenreFromServer = function () {
    fetch(
      'https://api.themoviedb.org/3/genre/movie/list?api_key=6a77f5a2cdf1a150f808f73c35533a92'
    )
      .then((r) => r.json())
      .then((data) => {
        const items = data.genres.map((genre, index) => {
          return {
            movieGenreName: genre.name,
            movieGenreId: genre.id,
          };
        });
        setMovieGenre(items);
      });
  };

  const getShowGenreFromServer = function () {
    fetch(
      'https://api.themoviedb.org/3/genre/tv/list?api_key=6a77f5a2cdf1a150f808f73c35533a92'
    )
      .then((r) => r.json())
      .then((data) => {
        const items = data.genres.map((genre, index) => {
          return {
            showGenreName: genre.name,
            showGenreId: genre.id,
          };
        });
        setShowGenre(items);
      });
  };

  useEffect(() => {
    getMovieGenreFromServer();
    getShowGenreFromServer();
  }, []);

  return (
    <>
      <HiOutlineMenu
        className="menuicon"
        size={40}
        variant="primary"
        onClick={handleShow}
      />

      <Offcanvas className="menu" show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <BiSolidMoviePlay
              className="menuIcon"
              size={30}
              onClick={HomePage}
            />
            <span className="menuIcon" onClick={HomePage}>
              <b>My Watchlist</b>
            </span>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="list">
            <Link className="listTitle" to="./Movies" onClick={handleClose}>
              Movies
            </Link>
            {movieGenre.map((item, index) => (
              <li className="listItem" key={index}>
                <Link
                  to={`/MovieGenre/${item.movieGenreId}/${encodeURIComponent(
                    item.movieGenreName
                  )}`}
                  onClick={handleClose}
                >
                  {item.movieGenreName}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="list">
            <Link className="listTitle" to="/Series" onClick={handleClose}>
              TV Shows
            </Link>
            {showGenre.map((item, index) => (
              <li className="listItem" key={index}>
                <Link
                  to={`/ShowGenre/${item.showGenreId}/${encodeURIComponent(
                    item.showGenreName
                  )}`}
                  onClick={handleClose}
                >
                  {item.showGenreName}
                </Link>
              </li>
            ))}
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Menu;
