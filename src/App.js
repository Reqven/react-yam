import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { HashRouter, NavLink, Route } from 'react-router-dom';
import { Container, Nav } from 'react-bootstrap';
import { History } from './pages/history/History'
import { Home } from './pages/home/Home'
import { Stats } from './pages/stats/Stats'


const App = () => {
  return (
    <HashRouter>
      <Container>
        <h1>Yam</h1>
        <div className="menu">
          <Nav fill variant="pills">
            <Nav.Item><Nav.Link exact as={NavLink} to="/">Home</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link exact as={NavLink} to="/history">History</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link exact as={NavLink} to="/stats">Stats</Nav.Link></Nav.Item>
          </Nav>
        </div>
        <div className="content">
          <Route exact path="/" component={Home} />
          <Route exact path="/history" component={History} />
          <Route exact path="/stats" component={Stats} />
        </div>
      </Container>
    </HashRouter>
  );
}

export default App;
