import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { UserContext } from '../../utils/Firebase'
import FirebaseSDK from 'firebase/app';


export default class Home extends Component {

  static contextType = UserContext;

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    FirebaseSDK.auth().signInWithEmailAndPassword(email, password)
      .then(success => console.log({ success }))
      .catch(error => console.log({ error }));
  }

  render() {
    const { email, password } = this.state;

    return (
      <Card>
        <Card.Body>
          <Card.Title>Login</Card.Title>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control required type="email" placeholder="Enter email" value={email} onChange={(e) => this.setState({ email: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control required type="password" placeholder="Password" value={password} onChange={(e) => this.setState({ password: e.target.value })} />
            </Form.Group>
            <Button size="sm" type="submit">Login</Button>
          </Form>
        </Card.Body>
      </Card>
    )
  }
}
