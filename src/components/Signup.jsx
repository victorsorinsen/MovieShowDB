import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { createUser } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUser(email, password);
      navigate('/Account');
    } catch (e) {
      setError('Invalid email or password');
      console.log(e.message);
    }
  };

  return (
    <div className="container">
      <div className="textsign">
        <h1>Sign up for a free account</h1>
        <p>
          Already have an account ? <Link to="/signin">Sign in.</Link>
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
          Sign Up
        </Button>
        <p className="error-message">{error}</p>
      </Form>
    </div>
  );
};

export default signup;
