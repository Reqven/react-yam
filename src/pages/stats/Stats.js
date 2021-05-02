import './Stats.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import * as moment from 'moment'
import { Card } from 'react-bootstrap'
import { UserContext } from '../../utils/Firebase'
import Yam from '../../utils/Yam'
import YamResults from '../../components/yam-results/YamResults'
import LoadingWidget from '../../components/loading-widget/LoadingWidget'
import Firebase from 'firebase/app'


export default class Stats extends Component {

  static contextType = UserContext;

  constructor(props) {
    super(props);

    this.state = {
      error: false,
      loading: true,
      yam: null,
      count: null,
      lastPlayed: null
    };
  }

  componentDidMount() {
    const { user } = this.context;

    this.timeout = setTimeout(() => {
      this.reference = Firebase.database()
        .ref('users')
        .child(user.uid)
        .child('history');

      this.reference.on('value', this.handleSnapshot, this.handleError);
    }, 500);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    if (this.reference) {
      this.reference.off();
    }
  }

  handleSnapshot = (snapshot) => {
    const state = {
      error: false,
      loading: false
    };
    const values = Object.values(snapshot.val() || {});
    const lastPlayed = values[values.length - 1]?.time;
    const count = values.length;

    const data = values.map(a => a.data || []).flat();
    const yam = Yam.from({data});
    this.setState({...state, yam, count, lastPlayed });
  }

  handleError = (error) => {
    console.log(error);
    this.setState({
      error: true,
      loading: false
    });
  }

  get lastPlayed() {
    const { lastPlayed } = this.state;
    if (!lastPlayed) return 'Never';
    return moment(lastPlayed).fromNow();
  }

  render() {
    const { loading, count, yam, error } = this.state;

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
            : <small className="text-muted">{error
                ? 'Unable to load statistics from Firebase'
                : `Last played: ${this.lastPlayed}`
              }</small>
          }
        </Card.Footer>
      </Card>
    )
  }
}
