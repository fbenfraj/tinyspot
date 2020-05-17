import React from "react";

const Login = (props) => {
  return (
    <div className="App">
      <h1>Welcome to TinySpot!</h1>
      <div>
        <h2>
          Please connect to your Spotify account thanks to the button below.
        </h2>
        <a href="http://localhost:8888/login">
          <button>Login with Spotify</button>
        </a>
      </div>
    </div>
  );
};

export default Login;
