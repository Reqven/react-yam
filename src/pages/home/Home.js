import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { FirebaseContext } from '../../utils/Firebase'
import YamResults from '../../components/yam-results/YamResults'
import Yam from '../../utils/Yam';


export default class Home extends Component {

  static contextType = FirebaseContext;

  constructor(props) {
    super(props);

    this.state = {
      autoSave: false,
      input: undefined,
      number: undefined,
      data: [],
      results: {}
    };
  }

  get Firebase() {
    return this.context;
  }

  handleInput = (e) => {
    const input = parseInt(e.target.value) || undefined;
    this.setState({ input, number: undefined });
  };
  handleCheckbox = (e) => {
    const autoSave = e.target.checked;
    this.setState({ autoSave });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const { input: number } = this.state;

    const data = [...Array(number)].map(() => Yam.dice(5));
    const results = Yam.process(data);
    this.setState({ number, results, data });
  }

  render() {
    const { autoSave, input, number, data, results } = this.state;
    return (
      <Card>
        <div className="form">
          <Card.Body>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group>
                <Form.Label>Number of throws</Form.Label>
                <Form.Control required type="number" placeholder="Number" value={input || ""} onChange={this.handleInput} />
                <Form.Text className="text-muted">For this round, 5 dices will be thrown {input || "x"} times.</Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Check type="checkbox" label="Auto-save results" defaultChecked={autoSave} onChange={this.handleCheckbox} />
              </Form.Group>
              <Button size="sm" type="submit">Throw</Button>
            </Form>
          </Card.Body>
        </div>

        {number &&
          <div className="results">
            <hr/>
            <Card.Body className="py-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Results</h5>
                {!autoSave && <Button size="sm" type="button">Save</Button>}
              </div>
              <p className="code">{JSON.stringify(data)}</p>
            </Card.Body>
            <YamResults results={results} />
          </div>
        }

        <Card.Footer className="text-muted">
          <small>{!this.Firebase.initialized
            ? 'Initializing Firebase..' : this.Firebase.ready
              ? 'Firebase is initialized, you can save your games.'
              : 'Firebase is not initialized, saving functionality is disabled.'
          }
          </small>
        </Card.Footer>
      </Card>
    )
  }
}
