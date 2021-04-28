import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import Yam from '../../utils/Yam';


export class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      input: undefined,
      number: undefined,
      data: [],
      results: {}
    };
  }

  handleInput = (e) => {
    const input = parseInt(e.target.value) || undefined;
    this.setState({ input, number: undefined });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const { input: number } = this.state;

    const data = [...Array(number)].map(() => Yam.dice(5));
    const results = Yam.process(data);
    this.setState({ number, results, data });
  }

  render() {
    const { input, number, data, results } = this.state;
    return (
      <Card>
        <Card.Body>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Label>Number of throws</Form.Label>
              <Form.Control required type="number" placeholder="Number" value={input || ""} onChange={this.handleInput} />
              <Form.Text className="text-muted">For this round, 5 dices will be thrown {input || "x"} times.</Form.Text>
            </Form.Group>
            <Button size="sm" type="submit">Throw</Button>
          </Form>
        </Card.Body>

        {number &&
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Results</h5>
            </div>
            <p>{JSON.stringify(data)}</p>
            <p>{JSON.stringify(results)}</p>
          </Card.Body>
        }
      </Card>
    )
  }
}
