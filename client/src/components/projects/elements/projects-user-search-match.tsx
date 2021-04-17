import { SyntheticEvent } from 'react';
import { UserObj } from '../../../../../src/types/index';
import Icon from '../../icon/icon';

interface Props {
  user: UserObj;
  onClick: () => void;
}

const ProjectsUserSearchMatch = ({ user, onClick }: Props) => {
  const fullName = `${user.firstName} ${user.lastName}`;
  return (
    <button
      className='projects__user-search-match'
      onClick={(e: SyntheticEvent) => {
        e.preventDefault();
        onClick();
      }}
    >
      <p className='projects__user-search-match-name'>{fullName}</p>
      <p className='projects__user-search-match-email'>{user.email}</p>
      <Icon icon='addOutline' size='medium' color='semiDark' padding={0.3} />
    </button>
  );
};

const renderSearchMatches = (
  projectId: number,
  onClick: (userObj: UserObj, projectId: number) => void
) => (matches: UserObj[]) =>
  matches.map(match => (
    <ProjectsUserSearchMatch
      key={match.uid}
      user={match}
      onClick={() => onClick(match, projectId)}
    />
  ));

export { renderSearchMatches };
