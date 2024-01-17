import React from 'react';
// import Background from './background';
import TrendingMovies from './Movies/TrendingMovies';
import TrendingSeries from './Series/TrendingSeries';
import Dropdown from 'react-bootstrap/Dropdown';
import { useEffect, useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import TestButton from './TestButton';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

const Home = () => {
  const authContext = UserAuth();
  const [authenticated, setAuthenticated] = useState(false);
  const auth = getAuth();
  const [movieData, setMovieData] = useState([]);

  useEffect(() => {
    if (authContext && authContext.user) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, [authContext]);

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = (isOpen) => {
    setDropdownOpen(isOpen);
  };

  console.log(0);

  const getData = async () => {
    try {
      const myData = [];
      const userId = auth.currentUser?.uid;
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
        setMovieData(myData);
      } else {
        console.log('User is not authenticated');
      }
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    }
  };

  console.log(movieData);

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="homeInfoDiv">
        <div className="homeText">
          <h3>
            <b>Welcome to My Watchlist.</b>
          </h3>
          <div>
            <p>
              Explore the latest movies and TV shows to stay in the loop with
              the hottest releases and discover compelling content across
              genres.
            </p>
            <p>
              Create and customize your personal watchlist to tailor your
              entertainment experience to your unique preferences and interests.
            </p>
          </div>
        </div>
        <Dropdown onToggle={handleDropdownToggle}>
          <Dropdown.Toggle
            className={`buton signInButon homeInfoButton${
              isDropdownOpen ? ' active' : ''
            }`}
            id="dropdown-basic"
          >
            <b>Explore</b>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="./Movies">Movies</Dropdown.Item>
            <Dropdown.Item href="./Series">TV Shows</Dropdown.Item>
            <Dropdown.Item href={authenticated ? './Watchlist' : './signin'}>
              Watchlist
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {/* <Background /> */}
      <TrendingMovies />
      <TrendingSeries />
      <TestButton />
    </>
  );
};

export default Home;
