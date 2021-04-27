import './App.css';
import React from 'react';
import { HashRouter, Link, Route } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { History } from './pages/history/History'
import { Home } from './pages/home/Home'
import { Stats } from './pages/stats/Stats'


const App = () => {
  return (
    <HashRouter>
      <Route path="/" render={({ location }) => (
        <Container maxWidth="sm">
          <h1>Yam</h1>
          <div className="nav">
            <Tabs value={location.pathname} indicatorColor="primary" textColor="primary" variant="fullWidth">
              <Tab component={Link} label="Home" value="/" to="/" />
              <Tab component={Link} label="History" value="/history" to="/history" />
              <Tab component={Link} label="Stats" value="/stats" to="/stats" />
            </Tabs>
          </div>
          <div className="content">
            <Route exact path="/" component={Home} />
            <Route exact path="/history" component={History} />
            <Route exact path="/stats" component={Stats} />
          </div>
        </Container>
        )}
      />
    </HashRouter>
  );
}

export default App;
