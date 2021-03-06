import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.svg';
import './App.css';

import React, { Component } from 'react';
import { Auth, UserContext } from './utils/Firebase';
import { HashRouter as Router, NavLink, Route, Switch, Redirect } from 'react-router-dom';
import { Container, Nav, Spinner, Navbar, NavDropdown } from 'react-bootstrap';
import Routes, { AuthenticatedRoute, NotAuthenticatedRoute } from './utils/Routes';
import { Play, History, Stats, Login } from './pages';


export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      initialized: false
    };
  }

  componentDidMount () {
    this.unsubscribe = Auth.onAuthStateChanged(user => {
      this.setState({ user, initialized: true });
    });
  }

  componentWillUnmount () {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  get UserContext() {
    const { user } = this.state;
    return { user, isAuthenticated: () => {
        return Boolean(user?.uid);
      }
    }
  }

  render() {
    const {initialized} = this.state;
    const {user, isAuthenticated} = this.UserContext;

    const LoadingNavbar = (
      <Navbar.Collapse>
        <Navbar.Text className="mr-auto">Loading...</Navbar.Text>
        <Spinner animation="border" variant="light" size="md">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Navbar.Collapse>
    );

    return (
      <Router>
        <UserContext.Provider value={this.UserContext}>
          <Navbar collapseOnSelect bg="dark" variant="dark" expand="sm" sticky="top">
            <Container>
              <Navbar.Brand>
                <img className="align-top" src={logo} width="30" height="30" />Yam
              </Navbar.Brand>
              <Navbar.Toggle/>
              {!initialized
                ? LoadingNavbar
                : <Navbar.Collapse>
                    <Nav className="mr-auto">
                      <Nav.Link exact eventKey={0} as={NavLink} to={Routes.PLAY}>Play</Nav.Link>
                      <Nav.Link exact eventKey={1} as={NavLink} to={Routes.HISTORY}>History</Nav.Link>
                      <Nav.Link exact eventKey={2} as={NavLink} to={Routes.STATS}>Stats</Nav.Link>
                    </Nav>
                    <Nav>{!isAuthenticated()
                      ? <Nav.Link exact eventKey={3} as={NavLink} to={Routes.LOGIN}>Login</Nav.Link>
                      : <NavDropdown title="Account" alignRight>
                          <NavDropdown.Header>{user.email}</NavDropdown.Header>
                          <NavDropdown.Item eventKey={4} onClick={() => Auth.signOut()}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    }</Nav>
                  </Navbar.Collapse>
              }
            </Container>
          </Navbar>
          {initialized &&
            <div className="content">
              <Container>
                <Switch>
                  <NotAuthenticatedRoute exact path={Routes.LOGIN} component={Login} />
                  <AuthenticatedRoute exact path={Routes.HISTORY} component={History} />
                  <AuthenticatedRoute exact path={Routes.STATS} component={Stats} />
                  <Route exact path={Routes.PLAY} component={Play} />
                  <Redirect from={Routes.HOME} to={Routes.PLAY} />
                  <Redirect to={Routes.HOME} />
                </Switch>
              </Container>
            </div>
          }
        </UserContext.Provider>
      </Router>
    );
  }
}
