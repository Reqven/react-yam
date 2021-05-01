import React from 'react';
import { Badge } from 'react-bootstrap';


const YamResults = ({ yam }) => {

  const resultFor = (number) => {
    return yam.results[number] || 0;
  }
  const renderItem = (title, value) => {
    return (
      <li className="list-group-item d-flex justify-content-between align-items-center">{title}
        <Badge pill variant="primary">{value}</Badge>
      </li>
    )
  }

  return (
    <ul className="list-group list-group-flush">
      { renderItem("Pair",            resultFor(2)) }
      { renderItem("Three of a kind", resultFor(3)) }
      { renderItem("Four of a kind",  resultFor(4)) }
      { renderItem("Yam",             resultFor(5)) }
    </ul>
  )
}

export default YamResults;
