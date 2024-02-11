import { getAuth, updateProfile } from 'firebase/auth';

const auth = getAuth();

updateProfile(auth.currentUser, {
  displayName: 'Jane Q. User',
  photoURL: 'https://example.com/jane-q-user/profile.jpg',
})
  .then(() => {
    // Profile updated!
    // ...
  })
  .catch((error) => {
    // An error occurred
    // ...
  });

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  try {
    //   await reauthenticate(auth.currentUser.email, currentPassword);
    await updateProfile(auth.currentUser, {
      displayName: 'Jane Q. User',
      photoURL: 'https://example.com/jane-q-user/profile.jpg',
    });
    navigate('/Account');

    // Update successful.
  } catch (e) {
    setError(e.message);
    console.log(e.message);
  }
};
