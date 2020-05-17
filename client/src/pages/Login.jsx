import React from "react";
import logo from "../logo.svg";

const Login = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Tinyspot</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <h2>
          Please connect to your Spotify account thanks to the button below.
        </h2>
        <a href="http://localhost:8888/login">
          <button className="whiteButton">Login with Spotify</button>
        </a>
      </header>
    </div>
  );
};

export default Login;
