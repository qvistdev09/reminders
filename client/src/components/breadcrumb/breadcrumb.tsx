import { Link } from 'react-router-dom';
import { useBreadcrumbs } from '../../hooks/use-breadcrumbs';
import Icon from '../icon/icon';

const Breadcrumb = () => {
  const breadcrumbs = useBreadcrumbs();
  return (
    <div className='breadcrumb'>
      <div className='breadcrumb__inner'>
        <Link to='/' className='breadcrumb__link breadcrumb__link--first'>
          home
        </Link>
        <Icon icon='chevronForward' color='semiDark' size='tiny' />
        {breadcrumbs.map(breadcrumb => (
          <div className='breadcrumb__crumbwrapper' key={breadcrumb.link}>
            <Link to={breadcrumb.link} className='breadcrumb__link'>
              {breadcrumb.beautifiedLink}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumb;
