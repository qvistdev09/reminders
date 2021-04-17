import { UserObj } from '../../../../../src/shared-types/index';
import Icon from '../../icon/icon';

interface Props {
  user: UserObj;
}

const ProjectsUserSearchMatch = ({ user }: Props) => {
  const fullName = `${user.firstName} ${user.lastName}`;
  return (
    <button className='projects__user-search-match'>
      <p className='projects__user-search-match-name'>{fullName}</p>
      <p className='projects__user-search-match-email'>{user.email}</p>
      <Icon icon='addOutline' size='medium' color='semiDark' padding={0.3} />
    </button>
  );
};

const renderSearchMatches = (matches: UserObj[]) =>
  matches.map(match => <ProjectsUserSearchMatch key={match.uid} user={match} />);

export { renderSearchMatches };
