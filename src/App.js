import './App.css';
import React from 'react';
import { HashRouter, NavLink, Route } from 'react-router-dom';
import { History } from './pages/history/History'
import { Home } from './pages/home/Home'
import { Stats } from './pages/stats/Stats'


function App() {
  return (
    <HashRouter>
      <div className="header">
        <ul className="nav">
          <li><NavLink exact to="/">Home</NavLink></li>
          <li><NavLink exact to="/history">History</NavLink></li>
          <li><NavLink exact to="/stats">Stats</NavLink></li>
        </ul>
      </div>
      <div className="content">
        <Route exact path="/" component={Home} />
        <Route exact path="/history" component={History} />
        <Route exact path="/stats" component={Stats} />
      </div>
    </HashRouter>
  );
}

export default App;
