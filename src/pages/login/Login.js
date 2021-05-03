import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component, Fragment } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { UserContext } from '../../utils/Firebase'
import Firebase from 'firebase/app';
import Routes from '../../utils/Routes'


export default class Login extends Component {

  static contextType = UserContext;
  static defaultRedirect = Routes.HOME;

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  componentWillUnmount () {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    Firebase.auth().signInWithEmailAndPassword(email, password)
      .then(this.onSuccess)
      .catch(this.onError);
  }

  onSuccess = () => {
    const { history, location } = this.props;
    const pathname = location.state?.referrer || Login.defaultRedirect;

    const redirect = (user) => user ? history.push(pathname) : null;
    this.unsubscribe = Firebase.auth().onAuthStateChanged(redirect);
  }
  onError = (error) => {
    console.log(error);
  }

  render() {
    const { email, password } = this.state;

    return (
      <Fragment>
        <div className="header">
          <h1>Login</h1>
          <p>You need to login to access your game history and the statistics.</p>
        </div>
        <Card>
          <Card.Body>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group>
                <Form.Label>Email address</Form.Label>
                <Form.Control required name="email" type="email" placeholder="Enter email" value={email} onChange={this.handleChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control required name="password" type="password" placeholder="Password" value={password} onChange={this.handleChange} />
              </Form.Group>
              <Button size="sm" type="submit">Login</Button>
            </Form>
          </Card.Body>
        </Card>
      </Fragment>
    )
  }
}
