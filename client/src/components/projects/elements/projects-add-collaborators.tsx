import { SyntheticEvent, useState } from 'react';
import FormLabelledInput from '../../form/elements/form-labelled-input';
import FormSearchWrapper from '../../form/elements/form-search-wrapper';
import PermissionsGrid from '../../permissions-grid/permissions-grid';
import { getSearchMatchRenderFunction } from './projects-user-search-match';
import { useAddNewUsers } from '../../../hooks/use-add-new-users';
import { useProjects } from '../../../hooks/use-projects';

interface Props {
  projectId: number;
  close: () => void;
}

const ProjectsAddCollaborators = ({ projectId, close }: Props) => {
  const [searchValue, setSearchValue] = useState('');
  const { addPermissions } = useProjects();
  const { searchMatches, selection, addUser, changeRole } = useAddNewUsers(projectId, searchValue);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    addPermissions(projectId, selection);
    close();
  };

  return (
    <form className='form' onSubmit={handleSubmit}>
      <FormSearchWrapper
        suggestions={searchMatches}
        renderFunction={getSearchMatchRenderFunction(projectId, addUser)}
      >
        <FormLabelledInput
          value={searchValue}
          onChange={setSearchValue}
          required={false}
          type='search'
          label='Search for users'
          id='user-search'
        />
      </FormSearchWrapper>
      {selection.length > 0 && (
        <PermissionsGrid permissions={selection} showOwner={false} changePermission={changeRole} />
      )}
      <button className='form__submit-btn utility--margin-top'>Save</button>
    </form>
  );
};

export default ProjectsAddCollaborators;
