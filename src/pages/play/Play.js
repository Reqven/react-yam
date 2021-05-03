import './Play.css';
import React, { Component, Fragment } from 'react';
import { Card, Button, Form, Spinner } from 'react-bootstrap';
import { UserContext, Database } from '../../utils/Firebase';
import { YamResults } from '../../components';
import Yam from '../../utils/Yam';


export default class Play extends Component {

  static contextType = UserContext;

  constructor(props) {
    super(props);

    this.state = {
      number: undefined,
      autoSave: false,
      pending: false,
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

    this.setState({ pending: true });
    const { id, time, data } = this.Yam;
    const value = { time, data };

    const onSuccess = () => {
      const yam = this.Yam.save();
      this.setState({ yam });
    };
    const onFinally = () => {
      setTimeout(() => {
        this.setState({ pending: false });
      }, 500);
    }

    Database
      .ref('users')
      .child(user.uid)
      .child('history')
      .child(id)
      .set(value)
        .then(onSuccess)
        .catch(console.log)
        .finally(onFinally);
  }

  render() {
    const Yam = this.Yam;
    const { number, autoSave, pending } = this.state;
    const authenticated = this.context.isAuthenticated();
    const canBeSaved = authenticated && !pending && !Yam.saved;

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
                  <Form.Check id="switch" type="switch" label="Auto-save" defaultChecked={autoSave} disabled={!authenticated} onChange={this.handleCheckbox} />
                </Form.Group>
                <Button size="sm" type="submit" disabled={pending}>Roll dice</Button>
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
                    {pending && <Spinner as="span" animation="border" size="sm" />}
                    {pending ? ' Saving..' : Yam.saved ? 'Saved' : 'Save'}
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
