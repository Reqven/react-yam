import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react'
import Firebase from 'firebase/app'
import { UserContext } from './utils/Firebase'
import { HashRouter as Router, NavLink, Route, Switch, Redirect } from 'react-router-dom';
import { Container, Nav, Spinner, Navbar, NavDropdown } from 'react-bootstrap'
import Routes, { AuthenticatedRoute } from './utils/Routes'
import { Home, History, Stats, Login } from './pages';


export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      initialized: false
    };
  }

  componentDidMount () {
    this.unsubscribe = Firebase.auth().onAuthStateChanged(user => {
      this.setState({ user, initialized: true });
    });
  }

  componentWillUnmount () {
    this.unsubscribe();
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
          <Navbar collapseOnSelect bg="dark" variant="dark" expand="sm">
            <Navbar.Brand>Yam</Navbar.Brand>
            <Navbar.Toggle/>
            {!initialized
              ? LoadingNavbar
              : <Navbar.Collapse>
                  <Nav className="mr-auto">
                    <Nav.Link exact eventKey={0} as={NavLink} to={Routes.HOME}>Play</Nav.Link>
                    <Nav.Link exact eventKey={1} as={NavLink} to={Routes.HISTORY}>History</Nav.Link>
                    <Nav.Link exact eventKey={2} as={NavLink} to={Routes.STATS}>Stats</Nav.Link>
                  </Nav>
                  <Nav>{!isAuthenticated()
                    ? <Nav.Link exact eventKey={3} as={NavLink} to={Routes.LOGIN}>Login</Nav.Link>
                    : <NavDropdown title="Account" alignRight>
                        <NavDropdown.Header>{user.email}</NavDropdown.Header>
                        <NavDropdown.Item eventKey={4} onClick={() => Firebase.auth().signOut()}>Logout</NavDropdown.Item>
                      </NavDropdown>
                  }</Nav>
                </Navbar.Collapse>
            }
          </Navbar>
          {initialized &&
            <Container>
              <h1>Yam</h1>
              <div className="content">
                <Switch>
                  <AuthenticatedRoute exact path={Routes.HISTORY} component={History} />
                  <AuthenticatedRoute exact path={Routes.STATS} component={Stats} />
                  <Route exact path={Routes.HOME} component={Home} />
                  <Route exact path={Routes.LOGIN} component={Login} />
                  <Redirect to={Routes.HOME} />
                </Switch>
              </div>
            </Container>
          }
        </UserContext.Provider>
      </Router>
    );
  }
}
