import './Stats.css';
import React, { Component, Fragment } from 'react';
import Firebase from 'firebase/app'
import * as moment from 'moment'
import { Card } from 'react-bootstrap'
import { UserContext } from '../../utils/Firebase'
import Yam from '../../utils/Yam'
import { LoadingWidget, YamResults } from '../../components'


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

  get countPlayed() {
    const { count } = this.state;
    if (!count) return 'No games played';
    return `${count} games played`;
  }

  get lastPlayed() {
    const { lastPlayed } = this.state;
    if (!lastPlayed) return 'Never';
    return moment(lastPlayed).fromNow();
  }

  render() {
    const { loading, yam, error } = this.state;

    return (
      <Fragment>
        <div className="header">
          <h1>Stats</h1>
          <p>
            Here you can find the statistics about all the different combinations and
            how many times you've obtained each of them from all the games you've saved.
          </p>
        </div>
        <Card>
          {!loading &&
            <Fragment>
              <Card.Body>
                <Card.Title className="my-0">{this.countPlayed}</Card.Title>
              </Card.Body>
              {yam && <YamResults yam={yam}/>}
            </Fragment>
          }
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
      </Fragment>
    )
  }
}
