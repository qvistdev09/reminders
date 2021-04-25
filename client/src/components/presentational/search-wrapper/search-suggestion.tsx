import { SyntheticEvent } from 'react';
import { UserObj } from 'reminders-shared/sharedTypes';
import Icon from '../icon/icon';

interface Props {
  user: UserObj;
  onClick: () => void;
}

const SearchSuggestion = ({ user, onClick }: Props) => {
  const fullName = `${user.firstName} ${user.lastName}`;
  return (
    <button
      className='search-wrapper__search-suggestion'
      onClick={(e: SyntheticEvent) => {
        e.preventDefault();
        onClick();
      }}
    >
      <p className='search-wrapper__search-suggestion-name'>{fullName}</p>
      <p className='search-wrapper__search-suggestion-email'>{user.email}</p>
      <Icon icon='addOutline' size='small' color='semiDark' padding={0.3} />
    </button>
  );
};

const getSearchMatchRenderFunction = (
  projectId: number,
  onClick: (userObj: UserObj, projectId: number) => void
) => (matches: UserObj[]) =>
  matches.map(match => (
    <SearchSuggestion key={match.uid} user={match} onClick={() => onClick(match, projectId)} />
  ));

export { getSearchMatchRenderFunction };
