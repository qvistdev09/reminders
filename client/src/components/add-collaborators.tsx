import { useState } from 'react';
import { SearchWrapper } from './presentational/search-wrapper/search-wrapper';
import PermissionsGrid from './presentational/permissions-grid/permissions-grid';
import { getSearchMatchRenderFunction } from './presentational/search-wrapper/search-suggestion';
import { useAddNewUsers } from '../hooks/use-add-new-users';
import { useProjects } from '../hooks/use-projects';
import { useModal } from '../hooks/use-modal';
import { Form } from './presentational/containers/form';
import { Button } from './presentational/button/button';
import { LabelledInput } from './presentational/inputs/labelled-input';

interface Props {
  projectId: number;
}

export const AddCollaborators = ({ projectId }: Props) => {
  const { closeModal } = useModal();
  const [searchValue, setSearchValue] = useState('');
  const { addPermissions } = useProjects();
  const { searchMatches, selection, addUser, changeRole } = useAddNewUsers(projectId, searchValue);

  const handleSubmit = () => {
    addPermissions(projectId, selection);
    closeModal();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <SearchWrapper
        suggestions={searchMatches}
        renderFunction={getSearchMatchRenderFunction(projectId, addUser)}
      >
        <LabelledInput
          value={searchValue}
          onChange={setSearchValue}
          required={false}
          type='search'
          label='Search for users'
          id='user-search'
        />
      </SearchWrapper>
      {selection.length > 0 && <PermissionsGrid permissions={selection} changePermission={changeRole} />}
      <Button label='Save' btnStyle='action' onClick={() => {}} />
    </Form>
  );
};
