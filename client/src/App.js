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
  const [profileImage, setProfileImage] = useState("");
  const [lastSavedTracks, setLastSavedTracks] = useState([]);

  useEffect(() => {
    if (params.access_token) {
      const userLastTracks = [];
      spotifyWebApi.setAccessToken(params.access_token);
      spotifyWebApi.getMySavedTracks().then((response) => {
        const firstSavedTracks = response.items.slice(0, 5);
        firstSavedTracks.forEach((item) => {
          const track = {
            name: item.track.name,
            artist: item.track.artists[0].name,
          };
          userLastTracks.push(track);
        });
        setLastSavedTracks(userLastTracks);
        console.log(lastSavedTracks);
      });
    }
  }, [params]);

  useEffect(() => {
    async function setUserInfos() {
      if (params.access_token) {
        const userData = await spotifyWebApi.getMe();
        setDisplayName(userData.display_name);
        setProfileImage(userData.images[0].url);
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

  function logout() {
    window.location.href = "http://localhost:3001";
  }

  return (
    <div className="App">
      <h1>Welcome to Tinyspot{loggedIn && ", " + displayName}!</h1>
      {!loggedIn && (
        <div>
          <h2>
            Please connect to your Spotify account thanks to the button below.
          </h2>
          <a href="http://localhost:8080/login">
            <button>Login with Spotify</button>
          </a>
        </div>
      )}
      {loggedIn && (
        <div>
          <img src={profileImage} alt="portrait" />
          <br />
          <button onClick={logout}>Logout</button>
          <p>Now playing: {nowPlaying.name}</p>
          <img src={nowPlaying.image} style={{ width: 100 }} alt="" />
          <br />
          <button onClick={getNowPlaying}>Check now playing</button>
          <button onClick={pauseSong}>Pause</button>
          <button onClick={playSong}>Play</button>
          <p>5 last liked songs:</p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {lastSavedTracks.map((track) => {
              return (
                <li>
                  {track.name} by {track.artist}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
