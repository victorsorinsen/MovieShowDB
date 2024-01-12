import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { UserAuth } from '../context/AuthContext';
import { getAuth } from 'firebase/auth';
import { addItemToWatchlist } from './exportFunctions';

const AddToWatchlistButton = () => {
  const authContext = UserAuth();
  const [authenticated, setAuthenticated] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [movieData, setMovieData] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    if (authContext && authContext.user) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, [authContext]);

  //   const addItemToWatchlist = async (item) => {
  //     try {
  //       const watchlist = await addDoc(collection(db, auth.currentUser.item), {
  //         item,
  //       });
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };

  const getData = async () => {
    try {
      const myData = [];
      const userId = auth.currentUser.uid;
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
        // Handle the case where the user is not authenticated (e.g., redirect to login)
      }
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    }
  };

  //   useEffect(() => {
  //     const isItemInWatchlist = movieData.some(
  //       (item) => item.docId === movie.docId
  //     );
  //     setIsDisabled(isItemInWatchlist);
  //   }, [movieData, movie]);

  console.log(movieData);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="addWatchlist">
      <Button
        className={`addWatchlistButton ${isDisabled ? 'disabled' : 'enabled'}`}
        variant="primary"
        title="Add to Watchlist"
        onClick={() => addItemToWatchlist(movieData[0])}
        disabled={isDisabled}
      >
        +
      </Button>
    </div>
  );
};

export default AddToWatchlistButton;
