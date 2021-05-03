import React from 'react'
import { Route, Redirect, useLocation } from 'react-router-dom';
import { UserContext } from './Firebase'


const Routes = {
  HOME: '/',
  PLAY: '/play',
  HISTORY: '/history',
  STATS: '/stats',
  LOGIN: '/login'
}
export default Routes;


export const AuthenticatedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = React.useContext(UserContext);
  const location = useLocation();

  const params = {
    to: {
      pathname: Routes.LOGIN,
      state: { referrer: location.pathname }
    }
  };

  return (
    <Route {...rest} render={(props) => isAuthenticated()
      ? <Component {...props} />
      : <Redirect {...params} />
    }/>
  )
}

export const NotAuthenticatedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = React.useContext(UserContext);

  return (
    <Route {...rest} render={(props) => isAuthenticated()
      ? <Redirect to={{ to: { pathname: Routes.HOME }}} />
      : <Component {...props} />
    }/>
  )
}
