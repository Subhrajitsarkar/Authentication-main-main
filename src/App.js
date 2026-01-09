import { useContext, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AuthContext from './store/auth-context';

function App() {
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const checkToken = async () => {
      // if token is not present, do nothing
      if (!authCtx.token) return;

      try {
        const res = await fetch(
          "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=YOUR_FIREBASE_API_KEY",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idToken: authCtx.token,
            }),
          }
        );
        // if token is invalid / expired
        if (!res.ok) {
          authCtx.logout();
        }
      } catch (error) {
        // network error or any unexpected error
        authCtx.logout();
      }
    };
    checkToken();
  }, [authCtx]);


  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>
        {!authCtx.isLoggedIn && (
          <Route path='/auth'>
            <AuthPage />
          </Route>
        )}
        <Route path='/profile'>
          {authCtx.isLoggedIn && <UserProfile />}
          {!authCtx.isLoggedIn && <Redirect to='/auth' />}
        </Route>
        <Route path='*'>
          <Redirect to='/' />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
