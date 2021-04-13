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
    <footer className='footer'>
      <div className='footer__inner'>
        <p className='footer__text'>by Oscar Lindqvist</p>
      </div>
    </footer>
  </>
);

export default App;
