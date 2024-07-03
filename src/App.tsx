import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import LoginForm from './components/login'
import BurgerBuilder from './components/burgerBuilder';
import styled from 'styled-components';

const StyledHeader = styled.header`
  background-color: #f36262;
  padding: 10px;
`;

function App() {

  return (
    <div className="App">
      <StyledHeader>
        <h1>Burger Builder</h1>
      </StyledHeader>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route
          path="/burger-build"
          element={
            <BurgerBuilder />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
