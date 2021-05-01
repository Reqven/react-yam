import './History.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import FirebaseSDK from '@firebase/app';
import { FirebaseContext } from '../../utils/Firebase'
import YamListItem from '../../components/yam-list-item/YamListItem'
import Yam from '../../utils/Yam'


export default class History extends Component {

  static contextType = FirebaseContext;

  constructor(props) {
    super(props);
    this.reference = null;
    this.state = { loading: true, games: [] };
  }

  initialize() {
    this.reference = FirebaseSDK.database().ref('history');
    this.reference.on('value', (snapshot) => {
      const games = Object.entries(snapshot.val() || {})
        .map(([id, data]) => Yam.from({...data, id}))
        .sort((a, b) => b.time - a.time);

      this.setState({ games, loading: false });
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

  render() {
    const { loading, games } = this.state;
    const { ready } = this.context;

    return (
      <Card>
        <Card.Header>
          <small className="text-muted">{loading ? 'Loading..' : ready
            ? (games.length > 0 ? `${games.length} games found` : 'No games found')
            : 'Unable to load games from Firebase'
          }
          </small>
        </Card.Header>
        <div className="list-group list-group-flush">
          {games.map(yam => <YamListItem key={yam.id} yam={yam} />)}
        </div>
      </Card>
    )
  }
}
