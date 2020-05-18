import React from "react";
import logo from "../logo.svg";

const Login = () => {
  return (
    <div className="App">
      <header className="App-header">
        <main className="login">
          <h1>Welcome to Tinyspot</h1>
          <img src={logo} className="App-logo" alt="logo" />
          <h2>
            Please connect to your Spotify account thanks to the button below.
          </h2>
          <a href="http://localhost:8888/login">
            <button className="whiteButton">Login with Spotify</button>
          </a>
        </main>
        <footer id="footer" style={{ position: "fixed", bottom: 0 }}>
          <p>
            2020 - <span className="white">Created by BEN FRAJ Farouk</span> -
            benfraj.farouk39@gmail.com
          </p>
        </footer>
      </header>
    </div>
  );
};

export default Login;
