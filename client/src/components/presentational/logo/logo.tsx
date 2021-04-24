import { Link } from 'react-router-dom';
import Icon from '../../icon/icon';
import './logo.scss';

export const Logo = () => {
  return (
    <Link to='/' className='logo'>
      <h1 className='logo__text'>
        <Icon padding={0} size='large' color='primary' /> reminders
      </h1>
    </Link>
  );
};
