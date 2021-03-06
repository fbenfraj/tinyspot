import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { spotifyWebApi } from "../../App";
import logo from "../../logo.svg";
import dashboardStyles from "./Dashboard.module.scss";

const Dashboard = () => {
  const params = getHashParams();
  const [loggedIn, setLoggedIn] = useState(true);
  const [nowPlaying, setNowPlaying] = useState({
    name: "",
    image: "",
  });
  const [displayName, setDisplayName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [lastSavedTracks, setLastSavedTracks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favoriteArtist, setFavoriteArtist] = useState({});
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    if (params.access_token || getCookie("access_token")) {
      const userLastTracks = [];
      if (params.access_token) {
        spotifyWebApi.setAccessToken(params.access_token);
      }
      if (getCookie("access_token")) {
        spotifyWebApi.setAccessToken(getCookie("access_token"));
      }
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
    } else {
      setLoggedIn(false);
    }
  }, [params.access_token]);

  useEffect(() => {
    setupFavorites();
  }, []);

  const setupFavorites = async () => {
    const favoriteArtists = await spotifyWebApi.getMyTopArtists();
    const favoriteTracks = await spotifyWebApi.getMyTopTracks();

    setFavoriteArtist({
      name: favoriteArtists.items[0].name,
      img: favoriteArtists.items[0].images[0].url,
    });

    const favoriteTracksTmp = [];
    favoriteTracks.items.slice(0, 5).forEach((track) => {
      favoriteTracksTmp.push({
        title: track.name,
        artist: track.artists[0].name,
      });
    });
    setTopTracks(favoriteTracksTmp);
  };

  useEffect(() => {
    async function setUserInfos() {
      if (params.access_token || getCookie("access_token")) {
        const userData = await spotifyWebApi.getMe();
        setDisplayName(userData.display_name);
        setProfileImage(userData.images[0].url);
      }
    }
    setUserInfos();
  }, [params.access_token]);

  useEffect(() => {
    getNowPlaying();
  }, []);

  function getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    if (hashParams.access_token) {
      document.cookie = "access_token=" + hashParams.access_token;
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

  async function previousSong() {
    try {
      await spotifyWebApi.skipToPrevious();
      setTimeout(async () => await getNowPlaying(), 250);
    } catch (e) {
      console.log(e);
    }
  }

  async function nextSong() {
    try {
      await spotifyWebApi.skipToNext();
      setTimeout(async () => await getNowPlaying(), 250);
    } catch (e) {
      console.log(e);
    }
  }

  function logout() {
    window.location.href = "http://localhost:3000/login";
    deleteCookie("access_token");
  }

  async function getNowPlaying() {
    try {
      const currentPlaybackState = await spotifyWebApi.getMyCurrentPlaybackState();
      currentPlaybackState.item && setIsPlaying(true);
      setNowPlaying({
        name: currentPlaybackState.item
          ? currentPlaybackState.item.name
          : "Nothing playing at the moment.",
        image:
          currentPlaybackState.item &&
          currentPlaybackState.item.album.images[0].url,
      });
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    console.log(nowPlaying);
  }, [nowPlaying]);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  function deleteCookie(name) {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }

  return (
    <div className="App">
      {!loggedIn && <Redirect to="/login" />}
      <div className="App-header">
        <header className={dashboardStyles.header}>
          <img id={dashboardStyles.logo} src={logo} alt="logo" />
          <h1 id={dashboardStyles.displayName}>{displayName}</h1>
          <button
            id={dashboardStyles.logout}
            className="whiteButton"
            onClick={logout}
          >
            Logout
          </button>
        </header>
        <main className={dashboardStyles.main}>
          <section className={dashboardStyles.presentation}>
            <div className={dashboardStyles.flexRow}>
              <img
                src={profileImage}
                id={dashboardStyles.portrait}
                alt="portrait"
              />
              <section>
                <p>Now playing: {nowPlaying.name}</p>
                <img src={nowPlaying.image} style={{ width: 100 }} alt="" />
                <br />
                {isPlaying && (
                  <div>
                    <button className="greenButton" onClick={previousSong}>
                      prev
                    </button>
                    <button className="whiteButton" onClick={pauseSong}>
                      ||
                    </button>
                    <button className="greenButton" onClick={playSong}>
                      Play
                    </button>
                    <button className="greenButton" onClick={nextSong}>
                      next
                    </button>
                  </div>
                )}
              </section>
            </div>
          </section>
          <section className={dashboardStyles.favorites}>
            <div className={dashboardStyles.favoritesCard}>
              <h2>Top 5 tracks:</h2>
              <ul className={dashboardStyles.trackList}>
                {topTracks.map((track, index) => {
                  return (
                    <li
                      key={index}
                      className={
                        index % 2 === 0 ? dashboardStyles.white : undefined
                      }
                    >
                      {track.title} - {track.artist}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className={dashboardStyles.favoritesCard}>
              <h2>Top artist: </h2>
              <span className={dashboardStyles.white}>
                {favoriteArtist.name}
              </span>
              <img
                className={dashboardStyles.topArtistImg}
                src={favoriteArtist.img}
                alt="favorite-artist"
              />
            </div>
            <div className={dashboardStyles.favoritesCard}>
              <h2>5 last liked songs:</h2>
              <ul className={dashboardStyles.trackList}>
                {lastSavedTracks.map((track, index) => {
                  return (
                    <li
                      key={index}
                      className={
                        index % 2 === 0 ? dashboardStyles.white : undefined
                      }
                    >
                      {track.name} - {track.artist}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </main>
        <footer id="footer">
          <p>
            2020 -
            <span className={dashboardStyles.white}>
              {" "}
              Created by BEN FRAJ Farouk{" "}
            </span>
            - farouk.ben-fraj@outlook.com -{" "}
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
      </div>
    </div>
  );
};

export default Dashboard;
