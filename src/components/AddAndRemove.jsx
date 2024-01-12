import React from 'react';
import { addItemToWatchlist } from './exportFunctions';
import { deleteItemFromWatchlist } from './exportFunctions';
import { TfiTrash } from 'react-icons/tfi';
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getDocs, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { UserAuth } from '../context/AuthContext';

const AddAndRemove = () => {
  const [removeButtonPressed, setRemoveButtonPressed] = useState(false);
  const authContext = UserAuth();
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const auth = getAuth();
  const [watchlistItems, setWatchlistItems] = useState([]);

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
    <div>
      {!isItemInWatchlist(myData[0]) ? (
        <button
          className="watchlistButton"
          onClick={() => addItemToWatchlist(movieDetails)}
        >
          Add to Watchlist
        </button>
      ) : (
        <button
          className="watchlistButton"
          onClick={() => deleteItemFromWatchlist(movie.docId)}
        >
          <TfiTrash /> Remove
        </button>
      )}
    </div>
  );
};

export default AddAndRemove;
