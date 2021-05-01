import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react'
import { HashRouter, NavLink, Route } from 'react-router-dom';
import { Container, Nav } from 'react-bootstrap';
import { Home, History, Stats } from './pages';
import Firebase, { FirebaseContext } from './utils/Firebase';


export default class App extends Component {

  constructor(props) {
    super(props);
    const firebase = new Firebase();

    this.state = {
      ready: false,
      initialized: false,
      promise: firebase.setup()
    };
  }

  componentDidMount () {
    this.state.promise.then(ready => {
      this.setState({ initialized: true, ready });
    });
  }

  render() {
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
            <FirebaseContext.Provider value={this.state}>
              <Route exact path="/" component={Home}/>
              <Route exact path="/history" component={History}/>
              <Route exact path="/stats" component={Stats}/>
            </FirebaseContext.Provider>
          </div>
        </Container>
      </HashRouter>
    );
  }
}
