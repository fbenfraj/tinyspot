import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import logo from "../logo.svg";

const Login = () => {
  const [serverIsOnline, setServerIsOnline] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      const response = await fetch("http://localhost:8888/ping");
      if (response.status === 200) {
        setServerIsOnline(true);
      }
    };
    checkServer();
  }, []);

  useEffect(() => {
    if (getCookie("access_token")) {
      setLoggedIn(true);
    }
  }, []);

  const login = () => {
    if (serverIsOnline) {
      window.location.href = "http://localhost:8888/login";
    } else {
      setErrorMessage("Couldn't reach the server. Please try again later.");
    }
  };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  return (
    <div className="App">
      {loggedIn && <Redirect to="/" />}
      <header className="App-header">
        <main className="login">
          <h1>Welcome to Tinyspot</h1>
          <img
            src={logo}
            className="App-logo"
            alt="logo"
            style={{ marginBottom: "20px" }}
          />
          <br />
          <button onClick={login} className="whiteButton">
            Login with Spotify
          </button>
          <br />
          <p style={{ marginTop: 0, color: "red", fontSize: "15px" }}>
            {errorMessage}
          </p>
        </main>
        <footer id="footer" style={{ position: "fixed", bottom: 0 }}>
          <p>
            2020 - <span className="white">Created by BEN FRAJ Farouk</span> -
            farouk.ben-fraj@outlook.com -{" "}
            <a
              href="https://github.com/fbenfraj/tinyspot"
              target="_blank"
              rel="noopener noreferrer"
              id="github"
            >
              github
            </a>
          </p>
        </footer>
      </header>
    </div>
  );
};

export default Login;
