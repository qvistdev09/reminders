import { Link } from 'react-router-dom';
import './nav-item.scss';

interface Props {
  label: string;
  icon: JSX.Element;
  to: string;
}

export const NavItem = ({ label, icon, to }: Props) => (
  <Link to={to} className='nav-item'>
    {icon}
    <p className='nav-item__label'>{label}</p>
  </Link>
);
