import React from 'react';
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaCircleUser } from 'react-icons/fa6';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect, useRef } from 'react';
import { CiEdit } from 'react-icons/ci';
import {
  getAuth,
  updateEmail,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { Form } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import Watchlist from './Watchlist';

const account = () => {
  const [showEmail, setShowEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, logout } = UserAuth();
  const [error, setError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showAlert, setShowAlert] = useState('');
  const [showName, setShowName] = useState(true);
  const authContext = UserAuth();

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

  const [editProfileName, setEditProfileName] = useState(
    user ? user.displayName : ''
  );
  const [displayName, setDisplayName] = useState(user ? user.displayName : '');

  const auth = getAuth();

  const editProfile = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('user is:', auth.currentUser);
      console.log('user is:', auth.currentUser.displayName);
      await updateProfile(auth.currentUser, {
        displayName: editProfileName,
        // photoURL: 'https://example.com/jane-q-user/profile.jpg',
      });
      setDisplayName(editProfileName);
      console.log('Updated display name:', auth.currentUser.displayName);
    } catch (e) {
      setError(e.message);
      console.log(e.message);
    }
  };

  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const reauthenticate = async (email, password) => {
    const credential = EmailAuthProvider.credential(email, password);
    return reauthenticateWithCredential(auth.currentUser, credential);
  };

  const UpdateEmail = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await reauthenticate(auth.currentUser.email, currentPassword);
      await updateEmail(auth.currentUser, newEmail);
      setShowEmail(false);
      setShowAlert(true);
    } catch (e) {
      setError('Invalid email or password');
      console.log(e.message);
    }
  };

  const UpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('user is:', auth.currentUser);
      await reauthenticate(auth.currentUser.email, currentPassword);
      await updatePassword(auth.currentUser, newPassword);
      setShowPassword(false);
      setShowAlert(true);
    } catch (e) {
      setError('Invalid password');
      console.log(e.message);
    }
  };

  const handleCloseModal = () => {
    setError('');
    setShowPassword(false);
    setShowEmail(false);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    let timeoutId;
    if (showAlert) {
      timeoutId = setTimeout(() => {
        setShowAlert(false);
      }, 3500);
    }
    return () => clearTimeout(timeoutId);
  }, [showAlert]);

  const toggleName = () => {
    setShowName(!showName);
  };

  const handleInput = (e) => {
    setEditProfileName(e.target.value);
  };

  const buttonActions = async (e) => {
    if (e) {
      e.preventDefault();
    }
    await editProfile(e);
    toggleName();
  };

  const handleInputClick = () => {
    const inputElement = document.getElementById('inputName');
    if (inputElement) {
      inputElement.select();
    }
  };

  return (
    <>
      {showAlert && (
        <Alert variant="success" onClose={handleCloseAlert} dismissible>
          <div className="alertText">Change successful!</div>
        </Alert>
      )}
      <div className="accountinfoMainDiv">
        <h2>Account Details</h2>
        <div className="accountInfoDiv">
          <FaCircleUser className="profilePic" size={100} />
          {/* <p>{user && user.email}</p> */}
          {showName && (
            <div className="profileName" id="profileName">
              {user.displayName === null
                ? user.email
                : user && user.displayName}
            </div>
          )}
          {!showName && (
            <input
              className="editProfileName"
              type="text"
              id="inputName"
              placeholder={user.displayName}
              onChange={handleInput}
              onClick={handleInputClick}
            />
          )}

          <CiEdit className="editProfileButton" onClick={buttonActions} />
          <div className="accountButtons">
            <Button
              className="buton signInButon"
              onClick={() => setShowEmail(true)}
            >
              <b>Update Email Address</b>
            </Button>
            <Button
              className="buton signInButon"
              onClick={() => setShowPassword(true)}
            >
              <b>Change Password</b>
            </Button>
            <Button className="buton signInButon" onClick={handleLogout}>
              <b>Logout</b>
            </Button>
          </div>
        </div>
      </div>

      <Modal
        className="trailerModal"
        show={showEmail}
        onHide={handleCloseModal}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            {/* <Background /> */}
            <div className="container-modal">
              <Form className="form" onSubmit={UpdateEmail}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    className="password"
                    type="password"
                    placeholder="Enter current password"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>New Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter new email"
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </Form.Group>
                <Button className="buton" variant="primary" type="submit">
                  Update
                </Button>
                <p className="error-message">{error}</p>
              </Form>
            </div>
          </>
        </Modal.Body>
      </Modal>
      <Modal
        className="trailerModal"
        show={showPassword}
        onHide={handleCloseModal}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            {/* <Background /> */}
            <div className="container-modal">
              <Form className="form" onSubmit={UpdatePassword}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    className="password"
                    type="password"
                    placeholder="Enter current password"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Form.Group>
                <Button className="buton" variant="primary" type="submit">
                  Update
                </Button>
                <p className="error-message">{error}</p>
              </Form>
            </div>
          </>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default account;
