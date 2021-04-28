import React, { Component } from 'react';
import { Badge } from 'react-bootstrap';
import Yam from '../../utils/Yam';


export default class YamResults extends Component {

  get results() {
    return this.props.results || {};
  }
  resultFor = (number) => {
    return this.results[number] || 0;
  }
  renderItem = (title, value) => {
    return (
      <li className="list-group-item d-flex justify-content-between align-items-center">{title}
        <Badge pill variant="primary">{value}</Badge>
      </li>
    )
  }

  render() {
    return (
      <ul className="list-group list-group-flush">
        { this.renderItem("Pair",            this.resultFor(2)) }
        { this.renderItem("Three of a kind", this.resultFor(3)) }
        { this.renderItem("Four of a kind",  this.resultFor(4)) }
        { this.renderItem("Yam",             this.resultFor(5)) }
      </ul>
    )
  }
}
