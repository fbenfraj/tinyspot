import React, { useState, useEffect } from "react";
import "./App.css";
import Spotify from "spotify-web-api-js";

const spotifyWebApi = new Spotify();

function App() {
  const params = getHashParams();
  const loggedIn = params.access_token ? true : false;
  const [nowPlaying, setNowPlaying] = useState({
    name: "Not checked.",
    image: "",
  });

  useEffect(() => {
    if (params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token);
    }
  }, [params]);

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

  return (
    <div className="App">
      <a href="http://localhost:8888">
        <button>Login with Spotify</button>
      </a>
      <div>
        <p>Now playing: {nowPlaying.name}</p>
        <img src={nowPlaying.image} style={{ width: 100 }} />
      </div>
      {loggedIn && <button onClick={getNowPlaying}>Check now playing</button>}
    </div>
  );
}

export default App;
