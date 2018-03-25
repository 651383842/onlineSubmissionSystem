import React, { Component } from 'react';
// import { BrowserRouter, Route, Link } from "react-router-dom";
import logo from './img/logo.svg';
import './css/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <ul>
            <li>Home</li>
          </ul>
        </p>
      </div>
    );
  }
}

export default App;
