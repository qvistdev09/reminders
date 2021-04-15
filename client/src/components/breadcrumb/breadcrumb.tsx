import { useLocation, Link } from 'react-router-dom';
import Icon from '../icon/icon';

const Breadcrumb = () => {
  const location = useLocation();
  let crumbs = location.pathname.split('/').filter(e => e !== '');

  const constructLink = (index: number, array: string[]) => {
    return `/${array.slice(0, index + 1).join('/')}`;
  };

  const beautify = (str: string) => {
    const withSpaces = str.replace(/-/g, ' ');
    if (withSpaces.includes('_')) {
      return withSpaces.split('_')[0];
    }
    return withSpaces;
  };

  return (
    <div className='breadcrumb'>
      <div className='breadcrumb__inner'>
        <Link to='/' className='breadcrumb__link breadcrumb__link--first'>
          home
        </Link>
        <Icon icon='chevronForward' color='semiDark' size='tiny' />
        {crumbs.map((crumb: string, index: number, array: string[]) => (
          <div className='breadcrumb__crumbwrapper' key={crumb + index.toString()}>
            <Link to={constructLink(index, array)} className='breadcrumb__link'>
              {beautify(crumb)}
            </Link>
            <Icon icon='chevronForward' color='semiDark' size='tiny' />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumb;
