import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import YamResults from '../../components/yam-results/YamResults'
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
        <div class="form">
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
        </div>

        {number &&
          <div className="results">
            <hr/>
            <Card.Body className="py-0">
              <h5 className="mb-0">Results</h5>
              <p className="code">{JSON.stringify(data)}</p>
            </Card.Body>
            <YamResults results={results} />
          </div>
        }
      </Card>
    )
  }
}
