import React, { useContext, useEffect, useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { FaCircleUser } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';

const Loggedin = () => {
  const authContext = UserAuth();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (authContext && authContext.user) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, [authContext]);

  const { user, logout } = UserAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      console.log('You are logged out');
    } catch (e) {
      console.log(e.message);
    }
  };

  const SignIn = () => {
    window.location.href = '/Signin';
  };

  const location = useLocation();
  const currentPage = location.pathname;

  if (authenticated) {
    return (
      <div className="nav-item">
        <Link className="accountIcon" to="/Account">
          <FaCircleUser size={30} />
          <p className="userAccountDisplay">
            {currentPage === '/Account'
              ? ''
              : user?.displayName || user?.email || ''}
          </p>
        </Link>

        <Button className="buton signInButon" onClick={handleLogout}>
          <b>Logout</b>
        </Button>
      </div>
    );
  } else {
    return (
      <div className="nav-item">
        <Button className="buton signInButon" onClick={SignIn}>
          <b>Sign in</b>
        </Button>
      </div>
    );
  }
};

export default Loggedin;
