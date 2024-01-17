import React from 'react';
import Signin from './components/Signin.jsx';
import Signup from './components/Signup.jsx';
import Account from './components/Account.jsx';
import { Route, Routes } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import Movies from './components/Movies.jsx';
import Series from './components/Series.jsx';
import Home from './components/Home.jsx';
import MovieGenre from './components/Genres/MovieGenre.jsx';
import ScrollToTop from './components/scrolltotop.jsx';
import Footer from './components/Footer.jsx';
import ShowDescription from './components/ShowDescription.jsx';
import MovieDescription from './components/MovieDescription.jsx';
import ShowGenre from './components/Genres/ShowGenre.jsx';
import SearchResults from './components/SearchResults.jsx';
import MovieSearchResults from './components/MovieSearchResults.jsx';
import ShowSearchResults from './components/ShowSearchResults.jsx';
import PersonDescription from './components/PersonDescription.jsx';
import Watchlist from './components/Watchlist.jsx';

function App() {
  return (
    <div className="mainContent">
      <AuthContextProvider>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Movies" element={<Movies />} />
          <Route path="/Series" element={<Series />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/MovieGenre/:id/:movieGenreName"
            element={<MovieGenre />}
          />
          <Route path="/ShowGenre/:id/:showGenreName" element={<ShowGenre />} />
          <Route path="/Movies/:id" element={<MovieDescription />} />
          <Route path="/tv/:id" element={<ShowDescription />} />
          <Route path="/Person/:id" element={<PersonDescription />} />
          <Route path="/Watchlist" element={<Watchlist />} />
          <Route
            path="/SearchResults/All/:keyword"
            element={<SearchResults />}
          />
          <Route
            path="/SearchResults/Movies/:keyword"
            element={<MovieSearchResults />}
          />
          <Route
            path="/SearchResults/TV Shows/:keyword"
            element={<ShowSearchResults />}
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </AuthContextProvider>
    </div>
  );
}

export default App;
