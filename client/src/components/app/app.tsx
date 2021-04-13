import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from '../header/header';
import SignUp from '../sign-up/sign-up';

const App = () => (
  <>
    <Header />
    <main className='main'>
      <div className='main__inner'>
        <BrowserRouter>
          <Switch>
            <Route exact path='/'>
              <p>You are at root</p>
            </Route>
            <Route exact path='/sign-up'>
              <SignUp />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </main>
    <footer>Footer here</footer>
  </>
);

export default App;
