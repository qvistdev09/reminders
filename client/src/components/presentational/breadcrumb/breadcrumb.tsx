import { Link } from 'react-router-dom';
import Icon from '../../icon/icon';
import './breadcrumb.scss';

interface Props {
  link: string;
  beautifiedLink: string;
}
export const Breadcrumb = ({ link, beautifiedLink }: Props) => {
  return (
    <div className='breadcrumb'>
      <Link to={link} className='breadcrumb__link'>
        {beautifiedLink}
      </Link>
      <Icon icon='chevronForward' color='primary' size='tiny' />
    </div>
  );
};
