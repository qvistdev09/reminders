import { UserObj } from '../../../../../src/shared-types/index';

interface Props {
  user: UserObj;
}

const ProjectsUserSearchMatch = ({ user }: Props) => {
  const fullName = `${user.firstName} ${user.lastName}`;
  return (
    <div className='projects__user-search-match'>
      <p className='projects__user-search-match-name'>{fullName}</p>
      <p className='projects__user-search-match-email'>{user.email}</p>
      <button className='projects__user-search-match-btn'>Add</button>
    </div>
  );
};

const renderSearchMatches = (matches: UserObj[]) =>
  matches.map(match => <ProjectsUserSearchMatch key={match.uid} user={match} />);

export { renderSearchMatches };
