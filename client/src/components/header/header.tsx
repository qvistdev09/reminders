import Icon from '../icon/icon';

const Header = () => (
  <header className='header'>
    <nav className='header__inner'>
      <h1 className='header__logo'>
        <Icon padding={0} size='medium' /> reminders
      </h1>
      <div className='header__login'>
        <button className='header__btn header__btn--action'>Sign up</button>
        <button className='header__btn'>Login</button>
      </div>
    </nav>
  </header>
);

export default Header;
