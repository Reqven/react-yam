import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
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
      <Card>
        <div className="form">
          <Card.Body>
            <Card.Title>Play</Card.Title>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group>
                <Form.Label>Number of throws</Form.Label>
                <Form.Control required type="number" placeholder="Number" value={number || ''} onChange={this.handleInput} />
                <Form.Text className="text-muted">For this round, 5 dices will be thrown {number || 'x'} times.</Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Check type="checkbox" label="Auto-save results" defaultChecked={autoSave} disabled={saveDisabled} onChange={this.handleCheckbox} />
              </Form.Group>
              <Button size="sm" type="submit">Throw</Button>
            </Form>
          </Card.Body>
        </div>

        {Yam.id &&
          <div className="results">
            <hr/>
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
    )
  }
}
