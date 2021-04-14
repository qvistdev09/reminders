import { useHistory } from 'react-router-dom';
import Icon from '../icon/icon';

const Header = () => {
  const history = useHistory();
  return (
    <header className='header'>
      <nav className='header__inner'>
        <h1 className='header__logo'>
          <Icon padding={0} size='medium' /> reminders
        </h1>
        <div className='header__login'>
          <button
            className='header__btn header__btn--action'
            onClick={() => history.push('/sign-up')}
          >
            Sign up
          </button>
          <button className='header__btn' onClick={() => history.push('/login')}>
            Login
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
