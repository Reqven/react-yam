import './Stats.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import * as moment from 'moment'
import { Card } from 'react-bootstrap'
import FirebaseSDK from '@firebase/app'
import { FirebaseContext } from '../../utils/Firebase'
import Yam from '../../utils/Yam'
import YamResults from '../../components/yam-results/YamResults'
import LoadingWidget from '../../components/loading-widget/LoadingWidget'


export default class Stats extends Component {

  static contextType = FirebaseContext;

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      yam: null,
      count: null,
      lastPlayed: null
    };
  }

  initialize() {
    this.reference = FirebaseSDK.database().ref('history');
    this.reference.on('value', (snapshot) => {

      const values = Object.values(snapshot.val() || {});
      const lastPlayed = values[values.length - 1]?.time;
      const count = values.length;

      const data = values.map(a => a.data || []).flat();
      const yam = Yam.from({data});

      setTimeout(() => {
        this.setState({ yam, count, lastPlayed, loading: false });
      }, 500);
    });
  }

  componentDidMount() {
    this.context.promise.then(ready => !ready
      ? this.setState({ loading: false })
      : this.initialize()
    );
  }

  componentWillUnmount() {
    if (this.reference) {
      this.reference.off();
    }
  }

  get lastPlayed() {
    const { lastPlayed } = this.state;
    if (!lastPlayed) return 'Never';
    return moment(lastPlayed).fromNow();
  }

  render() {
    const { loading, count, yam } = this.state;
    const { ready } = this.context;

    return (
      <Card>
        <React.Fragment>
          <Card.Body>
            <Card.Title><span className="badge badge-pill badge-primary">{count}</span> Games played</Card.Title>
            <Card.Text>Global statistics on all the games you've saved.</Card.Text>
          </Card.Body>
          {yam && <YamResults yam={yam} />}
        </React.Fragment>
        <Card.Footer>
          {loading
            ? <LoadingWidget variant="primary" />
            : <small className="text-muted">{ready
                ? `Last played: ${this.lastPlayed}`
                : 'Unable to load statistics from Firebase'
              }</small>
          }
        </Card.Footer>
      </Card>
    )
  }
}
