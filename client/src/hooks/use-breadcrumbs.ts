import { useLocation } from 'react-router-dom';

interface CrumbObject {
  link: string;
  beautifiedLink: string;
}

const useBreadcrumbs = (): CrumbObject[] => {
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

  const crumbObjects = crumbs.map((crumb: string, index: number, array: string[]) => ({
    link: constructLink(index, array),
    beautifiedLink: beautify(crumb),
  }));

  return crumbObjects;
};

export { useBreadcrumbs };
