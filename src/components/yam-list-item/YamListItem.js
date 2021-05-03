import React, { Fragment } from 'react'
import { Button } from 'react-bootstrap';
import YamResults from '../yam-results/YamResults';
import * as moment from 'moment';


const YamListItem = ({ yam }) => {
  const [collapsed, setCollapsed] = React.useState(true);

  return (
    <div className="list-group-item">
      <div className="d-flex w-100 justify-content-between">
        <div>
          <h5 className="mb-0">{yam.id}</h5>
          <small>{moment(yam.time).fromNow()}</small>
        </div>
        <Button size="sm" variant="link" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? 'Details' : 'Less'}
        </Button>
      </div>
      {!collapsed &&
        <Fragment>
          <p className="code">{JSON.stringify(yam.data)}</p>
          <YamResults yam={yam} />
        </Fragment>
      }
    </div>
  )
}

export default YamListItem;
