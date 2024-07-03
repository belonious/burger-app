import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

const StyledForm = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-left: auto;
  margin-right: auto;
`;
const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const StyledLoginButton = styled.button`
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
`;

const LoginForm: React.FC<{}> = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setErrorMessage(''); 
      const response = await login(name, password);
      navigate("/burger-build")
    } catch (error: any) {
      console.log(error);
      setErrorMessage(error.message);
    }
  };

  return (
    <StyledForm>
      <form onSubmit={handleSubmit}>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <label htmlFor="name">Name:</label>
        <StyledInput
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <StyledInput
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <StyledLoginButton type="submit">Login</StyledLoginButton>
      </form>
    </StyledForm>
  );
};

export default LoginForm;