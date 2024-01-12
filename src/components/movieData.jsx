import { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';

export const useMovieData = (authUser) => {
  const [movieData, setMovieData] = useState([]);

  const getDataFromFirestore = async (userId) => {
    try {
      const myData = [];
      const querySnapshot = await getDocs(collection(db, userId));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data && data.item !== undefined) {
          const movieData = data.item;
          myData.push(movieData);
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
    if (authUser) {
      getDataFromFirestore(authUser.uid);
    }
  }, [authUser, movieData]);

  return movieData;
};
