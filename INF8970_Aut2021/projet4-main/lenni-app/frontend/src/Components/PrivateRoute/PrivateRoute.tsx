// eslint-disable-next-line no-use-before-define
import { useState, useEffect } from 'react'
import {
  Route,
  Redirect
} from 'react-router-dom'
import { useAuth } from '../../Api/Auth/use-auth'

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute ({ children, admin, ...rest }: any) {
  const auth = useAuth()
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const res = await auth.checkConnected()
        if (disposed) return
        setIsConnected(res)
      } catch (err: any) {
        console.error(err)
      }
    })()

    return () => {
      disposed = true
    }
  }, [isConnected])

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isConnected
          ? (
              children
            )
          : (admin
            ? (<Redirect
              to={{
                pathname: '/login',
                state: { from: location }
                }}
              />)
            : (
              <Redirect
              to={{
                pathname: '/signin',
                state: { from: location }
                }}
              />
              )
            )
      }
    />
  )
}

export default PrivateRoute
