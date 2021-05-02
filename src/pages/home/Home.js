import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component, Fragment } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { UserContext } from '../../utils/Firebase'
import Firebase from 'firebase/app';
import Yam from '../../utils/Yam';
import YamResults from '../../components/yam-results/YamResults'


export default class Home extends Component {

  static contextType = UserContext;

  constructor(props) {
    super(props);

    this.state = {
      number: undefined,
      autoSave: false,
      yam: new Yam()
    };
  }

  get Yam() {
    return this.state.yam;
  }

  handleInput = (e) => {
    const yam = this.Yam.reset();
    const number = parseInt(e.target.value) || undefined;
    this.setState({ number, yam });
  };
  handleCheckbox = (e) => {
    const autoSave = e.target.checked;
    this.setState({ autoSave });
  };
  handleSubmit = (e) => {
    e.preventDefault();

    const { number, autoSave } = this.state;
    const yam = this.Yam.play(number);
    this.setState({ yam });

    if (autoSave) {
      this.save();
    }
  }

  save() {
    const { user, isAuthenticated } = this.context;
    if (!isAuthenticated()) { return; }

    const yam = this.Yam.save();
    const { id: time, data } = yam;

    Firebase.database()
      .ref('users')
      .child(user.uid)
      .child('history')
      .child(time)
      .set({ time, data })
      .then(() => this.setState({ yam }))
  }

  render() {
    const Yam = this.Yam;
    const { autoSave, number } = this.state;
    const saveDisabled = !this.context.isAuthenticated();
    const canBeSaved = !Yam.saved && this.context.isAuthenticated();

    return (
      <Fragment>
        <div className="header">
          <h1>Play</h1>
          <p>
            The objective of the game is to score points by rolling five dice to make certain
            combinations. To try to make various scoring combinations, you can choose how many
            times the five dice must be rolled. A Yam is five-of-a-kind.
          </p>
        </div>
        <Card>
          <div className="form">
            <Card.Body>
              <Form onSubmit={this.handleSubmit}>
                <Form.Group>
                  <Form.Label>Number of dice rolls</Form.Label>
                  <Form.Control required type="number" placeholder="Number" value={number || ''} onChange={this.handleInput} />
                  <Form.Text className="text-muted">For this game, the five dice will be rolled {number || 'x'} times.</Form.Text>
                </Form.Group>
                <Form.Group>
                  <Form.Check id="switch" type="switch" label="Auto-save" defaultChecked={autoSave} disabled={saveDisabled} onChange={this.handleCheckbox} />
                </Form.Group>
                <Button size="sm" type="submit">Roll dice</Button>
              </Form>
            </Card.Body>
          </div>

          {Yam.id &&
            <div className="results">
              <hr className="mt-0"/>
              <Card.Body className="py-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Results</h5>
                  <Button size="sm" disabled={!canBeSaved} onClick={() => this.save()}>
                    {Yam.saved ? 'Saved' : 'Save'}
                  </Button>
                </div>
                <p className="code">{JSON.stringify(Yam.data)}</p>
              </Card.Body>
              <YamResults yam={Yam} />
            </div>
          }
        </Card>
      </Fragment>
    )
  }
}
