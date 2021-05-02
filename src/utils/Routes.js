import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from './Firebase'

const Routes = {
  HOME: '/',
  HISTORY: '/history',
  STATS: '/stats',
  LOGIN: '/login'
}
export default Routes;

export const AuthenticatedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = React.useContext(UserContext);

  return (
    <Route {...rest} render={(props) => isAuthenticated()
      ? <Component {...props} />
      : <Redirect to="/login" />
    }
    />
  )
}
