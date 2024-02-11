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
  deleteUser,
} from 'firebase/auth';
import { Form } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import { getDoc, getDocs, collection, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { TfiTrash } from 'react-icons/tfi';
import Accordion from 'react-bootstrap/Accordion';
import { GoDotFill } from 'react-icons/go';
import { FaStar } from 'react-icons/fa';

const account = () => {
  const [showEmail, setShowEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, logout } = UserAuth();
  const [error, setError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showAlert, setShowAlert] = useState('');
  const [showName, setShowName] = useState(true);
  const authContext = UserAuth();
  const [showManageUsers, setManageUsers] = useState({});
  const [showUsers, setShowUsers] = useState([]);
  const [showReviews, setShowReviews] = useState([]);

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
      await updateProfile(auth.currentUser, {
        displayName: editProfileName,
        // photoURL: 'https://example.com/jane-q-user/profile.jpg',
      });
      setDisplayName(editProfileName);
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserFromFirestore(user);
      } else {
        console.log('No authenticated user found.');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getUserFromFirestore = async (user) => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        setManageUsers(userData);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    }
  };

  const getUserListfromFirestore = async () => {
    try {
      const userList = [];
      const querySnapshot = await getDocs(collection(db, 'users'));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const userData = data;

        if (userData) {
          userList.push(userData);
        } else {
          console.log('Item is undefined');
        }
      });

      setShowUsers(userList);
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    }
  };

  const handleAdminChange = (index) => {
    setShowUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      updatedUsers[index] = {
        ...updatedUsers[index],
        admin: !updatedUsers[index].admin,
      };
      return updatedUsers;
    });
  };

  const handleEditChange = (index) => {
    setShowUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      updatedUsers[index] = {
        ...updatedUsers[index],
        edit: !updatedUsers[index].edit,
      };
      return updatedUsers;
    });
  };

  const cancelManageUsers = () => {
    setShowUsers([]);
  };

  const updateUsers = async () => {
    try {
      const batch = writeBatch(db);

      await Promise.all(
        showUsers.map(async (user) => {
          try {
            if (user && user.uid !== undefined) {
              const userRef = doc(db, 'users', user.uid);

              // Use updateDoc correctly
              await updateDoc(userRef, {
                admin: user.admin,
                edit: user.edit,
              });
            } else {
              console.warn('Skipping user update - missing uid:', user);
            }
          } catch (error) {
            console.error('Error updating a user:', error);
          }
        })
      );

      await batch.commit();
      setShowUsers([]);
    } catch (error) {
      console.error('Error updating users:', error);
    }
  };

  const removeUser = async (uid) => {
    try {
      // Delete user from Firebase Authentication using UID
      await deleteUser(uid);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const getPendingReviewsfromFirestore = async () => {
    try {
      const pendingReviews = [];
      const querySnapshot = await getDocs(collection(db, 'reviews'));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const reviews = data;

        if (pendingReviews) {
          pendingReviews.push(reviews);
        } else {
          console.log('Item is undefined');
        }
      });

      setShowReviews(pendingReviews);
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    }
  };

  const closePendingReviews = () => {
    setShowReviews([]);
  };

  const approveReview = async (review) => {
    try {
      const userReview = doc(
        db,
        'reviews',
        `${review.movieId} - ${review.uid}`
      );

      await updateDoc(userReview, {
        status: 'approved',
      });

      setShowReviews((prevReviews) => {
        const filteredReviews = prevReviews.filter(
          (prevReview) =>
            prevReview.movieTitle !== review.movieTitle ||
            prevReview.user !== review.user
        );

        return filteredReviews;
      });
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const declineReview = async (review) => {
    try {
      await deleteDoc(doc(db, 'reviews', `${review.movieId} - ${review.uid}`));

      setShowReviews((prevReviews) => {
        const filteredReviews = prevReviews.filter(
          (prevReview) =>
            prevReview.movieTitle !== review.movieTitle ||
            prevReview.user !== review.user
        );

        return filteredReviews;
      });
    } catch (error) {
      console.error('Error declining review:', error);
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
          <div className="manageButtons">
            {showManageUsers.admin === true ? (
              <Button
                className="buton signInButon"
                onClick={getUserListfromFirestore}
              >
                Manage Users
              </Button>
            ) : (
              ''
            )}
            {showManageUsers.edit === true ? (
              <Button
                className="buton signInButon"
                onClick={getPendingReviewsfromFirestore}
              >
                Manage Reviews
              </Button>
            ) : (
              ''
            )}
          </div>
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

      {showUsers.length !== 0 ? (
        <div className="manageContainer">
          <div className="usersContainer">
            <ul className="headerRow">
              <li className="userItem">
                <span>
                  <b>Email</b>
                </span>
              </li>
              <li>
                <div className="headerLabel">
                  <span>Admin Rights</span>
                </div>
              </li>
              <li>
                <div className="headerLabel">
                  <span>Review Rights</span>
                </div>
              </li>
              <li className="userItem">
                <span></span>
              </li>
            </ul>
            {showUsers.map((item, index) => (
              <ul className="userList" key={index}>
                <li className="userItem">
                  <span>{item.email}</span>
                </li>
                <li>
                  <div className="checkboxContainer">
                    <input
                      type="checkbox"
                      checked={item.admin}
                      onChange={() => handleAdminChange(index)}
                    />
                  </div>
                </li>
                <li>
                  <div className="checkboxContainer">
                    <input
                      type="checkbox"
                      checked={item.edit}
                      onChange={() => handleEditChange(index)}
                    />
                  </div>
                </li>
                {/* <li className="userItem">
                  <button
                    className="watchlistButton"
                    onClick={() => removeUser(item.uid)}
                  >
                    <TfiTrash /> Delete user
                  </button>
                </li> */}
              </ul>
            ))}
          </div>
          <div className="userButtons">
            <Button className="genreButon" onClick={updateUsers}>
              Confirm
            </Button>
            <Button className="genreButon" onClick={cancelManageUsers}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        ''
      )}
      {showReviews.length > 0 && (
        <div className="manageContainer">
          {showReviews.filter((item) => item.status === 'pending').length >
          0 ? (
            showReviews
              .filter((item) => item.status === 'pending')
              .map((item, index) => (
                <Accordion key={index}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <div className="reviewTitle">
                        <span>
                          <b>{item.title}</b>
                        </span>
                        <span className="nameAndDate">
                          {item.user}
                          {' - '}
                          {item.date &&
                            new Date(
                              item.date.seconds * 1000 +
                                Math.floor(item.date.nanoseconds / 1000000)
                            ).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                        </span>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p>
                        <FaStar className="starrating" size={25} />
                        {item.rating}
                        {'/10'}
                      </p>
                      <p>{item.description}</p>
                      <Button
                        className="watchlistButtongreen"
                        onClick={() => {
                          approveReview(item);
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        className="watchlistButton"
                        onClick={() => declineReview(item)}
                      >
                        Decline
                      </Button>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ))
          ) : (
            <div>No pending reviews</div>
          )}
          <Button className="genreButon" onClick={closePendingReviews}>
            Close
          </Button>
        </div>
      )}
    </>
  );
};

export default account;
