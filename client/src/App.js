import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Spotify from "spotify-web-api-js";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

export const spotifyWebApi = new Spotify();

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Dashboard />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
