import React, { useState, useEffect } from "react";
import "./App.css";
import Spotify from "spotify-web-api-js";

const spotifyWebApi = new Spotify();

function App() {
  const params = getHashParams();
  const loggedIn = params.access_token ? true : false;
  const [nowPlaying, setNowPlaying] = useState({
    name: "Click on the button below to find out!",
    image: "",
  });
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token);
    }
  }, [params]);

  useEffect(() => {
    async function setUserInfos() {
      if (params.access_token) {
        const userData = await spotifyWebApi.getMe();
        console.log(userData);
        setDisplayName(userData.display_name);
      }
    }
    setUserInfos();
  }, [params.access_token]);

  function getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  async function getNowPlaying() {
    try {
      const currentPlaybackState = await spotifyWebApi.getMyCurrentPlaybackState();
      setNowPlaying({
        name: currentPlaybackState.item.name,
        image: currentPlaybackState.item.album.images[0].url,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function pauseSong() {
    try {
      await spotifyWebApi.pause();
    } catch (e) {
      console.log(e);
    }
  }

  async function playSong() {
    try {
      await spotifyWebApi.play();
    } catch (e) {
      console.log(e);
    }
  }

  async function getMe() {
    try {
      const response = await spotifyWebApi.getMe();
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="App">
      <h1>Welcome to Tinyspot{loggedIn && ", " + displayName}!</h1>
      {!loggedIn && (
        <div>
          <h2>
            Please connect to your Spotify account thanks to the button below.
          </h2>
          <a href="http://localhost:8888/login">
            <button>Login with Spotify</button>
          </a>
        </div>
      )}
      {loggedIn && (
        <div>
          <p>Now playing: {nowPlaying.name}</p>
          <img src={nowPlaying.image} style={{ width: 100 }} />
          <br />
          <button onClick={getNowPlaying}>Check now playing</button>
          <button onClick={pauseSong}>Pause</button>
          <button onClick={playSong}>Play</button>
        </div>
      )}
    </div>
  );
}

export default App;
