import './History.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component, Fragment } from 'react';
import { Card } from 'react-bootstrap';
import Firebase from 'firebase/app';
import { UserContext } from '../../utils/Firebase'
import Yam from '../../utils/Yam'
import YamListItem from '../../components/yam-list-item/YamListItem'
import LoadingWidget from '../../components/loading-widget/LoadingWidget'


export default class History extends Component {

  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.reference = null;

    this.state = {
      games: [],
      error: false,
      loading: true
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
      loading: false,
      games: Object.entries(snapshot.val() || {})
        .map(([id, data]) => Yam.from({...data, id}))
        .sort((a, b) => b.time - a.time)
    };
    this.setState(state);
  }

  handleError = (error) => {
    console.log(error);
    this.setState({
      error: true,
      loading: false
    });
  }

  render() {
    const { games, error, loading } = this.state;

    return (
      <Fragment>
        <div className="header">
          <h1>History</h1>
          <p>
            Every game you've saved on the main page will be displayed here. You can click
            on the "Details" button to collapse a specific game in order to review the
            dataset with all the dice and the results associated.
          </p>
        </div>
        <Card>
          <Card.Header>
            {loading
              ? <LoadingWidget variant="primary"/>
              : <small className="text-muted">{error
                  ? 'Unable to load game history from Firebase'
                  : (games.length > 0 ? `${games.length} games found` : 'No games found')
                }</small>
            }
          </Card.Header>
          <div className="list-group list-group-flush">
            {games.map(yam => <YamListItem key={yam.id} yam={yam} />)}
          </div>
        </Card>
      </Fragment>
    )
  }
}
