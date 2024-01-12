import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
// import Background from './background';

const signin = () => {
  const { signIn } = UserAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signIn(email, password);
      navigate(-1);
    } catch (e) {
      setError('Invalid email or password');
      console.log(e.message);
    }
  };

  return (
    <>
      {/* <Background /> */}
      <div className="container">
        <div className="textsign">
          <h1>Sign in to your account</h1>

          <p>
            Don't have an account yet ? <Link to="/signup">Sign up.</Link>
          </p>
        </div>
        <Form className="form" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              className="email"
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button className="buton" variant="primary" type="submit">
            Sign In
          </Button>
          <p className="error-message">{error}</p>
        </Form>
      </div>
    </>
  );
};

export default signin;
