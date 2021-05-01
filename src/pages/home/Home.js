import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { FirebaseContext } from '../../utils/Firebase'
import FirebaseSDK from '@firebase/app';
import YamResults from '../../components/yam-results/YamResults'
import Yam from '../../utils/Yam';


export default class Home extends Component {

  static contextType = FirebaseContext;

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
    if (!this.context.ready) {
      return;
    }
    const yam = this.Yam.save();
    const { id: time, data } = yam;
    const path = `history/${time}`;

    FirebaseSDK.database()
      .ref(path)
      .set({ time, data })
      .then(() => this.setState({ yam }))
  }

  render() {
    const Yam = this.Yam;
    const { autoSave, number } = this.state;
    const { initialized, ready } = this.context;
    const saveDisabled = !ready || Yam.saved;

    return (
      <Card>
        <div className="form">
          <Card.Body>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group>
                <Form.Label>Number of throws</Form.Label>
                <Form.Control required type="number" placeholder="Number" value={number || ''} onChange={this.handleInput} />
                <Form.Text className="text-muted">For this round, 5 dices will be thrown {number || 'x'} times.</Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Auto-save results"
                  defaultChecked={autoSave}
                  disabled={!ready}
                  onChange={this.handleCheckbox}
                />
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
                <Button size="sm" disabled={saveDisabled} onClick={() => this.save()}>
                  {Yam.saved ? 'Saved' : 'Save'}
                </Button>
              </div>
              <p className="code">{JSON.stringify(Yam.data)}</p>
            </Card.Body>
            <YamResults yam={Yam} />
          </div>
        }

        <Card.Footer className="text-muted">
          <small>{!initialized ? 'Initializing Firebase..' : ready
            ? 'Firebase is initialized, you can save your games.'
            : 'Firebase is not initialized, saving functionality is disabled.'
          }
          </small>
        </Card.Footer>
      </Card>
    )
  }
}
