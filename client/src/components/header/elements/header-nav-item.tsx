import { Link } from 'react-router-dom';

interface Props {
  label: string;
  icon: JSX.Element;
  to: string;
}

const HeaderNavItem = ({ label, icon, to }: Props) => (
  <Link to={to} className='header__nav-item'>
    {icon}
    <p className='header__nav-item-label'>{label}</p>
  </Link>
);

export default HeaderNavItem;
