import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { spotifyWebApi } from "../../App";
import logo from "../../logo.svg";
import dashboardStyles from "./Dashboard.module.scss";

const Dashboard = () => {
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
      });
    }
  }, [params.access_token]);

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
    window.location.href = "http://localhost:3000";
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
      {!loggedIn && <Redirect to="/login" />}
      <div className="App-header">
        <header className={dashboardStyles.header}>
          <img src={logo} alt="logo" height="100px" />
          <h1>Welcome to Tinysport, {displayName}!</h1>
          <button className="whiteButton" onClick={logout}>
            Logout
          </button>
        </header>
        <img
          src={profileImage}
          className={dashboardStyles.portrait}
          alt="portrait"
        />
        <main className={dashboardStyles.main}>
          <section>
            <p>Now playing: {nowPlaying.name}</p>
            <img src={nowPlaying.image} style={{ width: 100 }} alt="" />
            <br />
            <button className="whiteButton" onClick={getNowPlaying}>
              Check now playing
            </button>
            <button className="whiteButton" onClick={pauseSong}>
              Pause
            </button>
            <button className="whiteButton" onClick={playSong}>
              Play
            </button>
          </section>
          <section>
            <p>5 last liked songs:</p>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {lastSavedTracks.map((track, index) => {
                return (
                  <li key={index}>
                    {track.name} by {track.artist}
                  </li>
                );
              })}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
