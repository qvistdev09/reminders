import { ProjectObject, UserInPermissionsGrid } from 'reminders-shared/sharedTypes';
import { useAppUserDetails } from '../hooks/use-app-user-details';
import { useModal } from '../hooks/use-modal';
import { useProjects } from '../hooks/use-projects';
import { AddCollaborators } from './add-collaborators';
import Icon from './icon/icon';
import { Button } from './presentational/button/button';
import { DestructiveButton } from './presentational/button/destructive-button';
import { SettingsButton } from './presentational/button/settings-button';
import { ExpandableCard } from './presentational/containers/expandable-card';
import { Flex } from './presentational/containers/flex';
import { ProjectTitle } from './presentational/headers/project-title';
import { SettingsHeader } from './presentational/headers/settings-header';
import { Select } from './presentational/inputs/select';
import { LinkRow } from './presentational/links/link-row';
import { Warning } from './presentational/messages/warning';
import Modal from './presentational/modal/modal';
import PermissionsGrid from './presentational/permissions-grid/permissions-grid';
import { Text } from './presentational/texts/text';

interface Props {
  project: ProjectObject;
}

export const ProjectCard = ({ project }: Props) => {
  const { changeVisibility, deleteProject, editPermission } = useProjects();
  const { activeModal, setModal, closeModal } = useModal();
  const { projectTitle, projectId, permissions, projectVisibility } = project;
  const appUser = useAppUserDetails();
  const slug = `${projectTitle.toLowerCase().replace(/\s/g, '-')}_${projectId}`;

  const ownerObj: UserInPermissionsGrid = {
    firstName: appUser.firstName,
    lastName: appUser.lastName,
    email: appUser.email,
    uid: appUser.uid,
    permissionRole: 'editor',
  };

  const handleVisibilitySelectChange = (newSetting: string) => {
    if (newSetting === 'authorizedOnly' || newSetting === 'public' || newSetting === 'private') {
      changeVisibility(projectId, newSetting);
    }
  };

  const headerObj = (
    <LinkRow to={`/projects/${slug}`}>
      <Icon icon='open' color='primary' size='medium' />
      <ProjectTitle label={projectTitle} />
    </LinkRow>
  );
  const button = (
    <>
      <Text>Configure</Text>
      <Icon icon='chevronForward' color='semiDark' size='tiny' />
    </>
  );
  const buttonExpanded = (
    <>
      <Text>Configure</Text>
      <Icon icon='chevronDown' color='semiDark' size='tiny' />
    </>
  );

  const visibilityOptions = [
    { value: 'private', label: 'Private' },
    { value: 'authorizedOnly', label: 'Collaborators' },
    { value: 'public', label: 'Public' },
  ];

  return (
    <ExpandableCard headerObj={headerObj} button={button} buttonExpanded={buttonExpanded}>
      <Flex direction='column' align='stretch' childrenGap='big'>
        <Flex direction='column' align='stretch' childrenGap='small'>
          <Flex direction='row' justify='between' align='center'>
            <SettingsHeader label='Permissions' />
            <SettingsButton
              label='Add'
              onClick={() => setModal(`${projectId.toString()}-add-collaborators`)}
            />
          </Flex>
          <PermissionsGrid
            permissions={permissions}
            changePermission={change => editPermission(projectId, change)}
            owner={ownerObj}
          />
        </Flex>
        <Flex direction='column' align='start' childrenGap='small'>
          <SettingsHeader label='Visibility' />
          <Select
            choices={visibilityOptions}
            value={projectVisibility}
            onChange={handleVisibilitySelectChange}
          />
        </Flex>
        <DestructiveButton
          label='Delete project'
          onClick={() => setModal(`${projectId.toString()}-delete`)}
          dontStretch={true}
        />
      </Flex>
      {activeModal === `${projectId.toString()}-add-collaborators` && (
        <Modal label='Add collaborators' close={closeModal}>
          <AddCollaborators projectId={projectId} />
        </Modal>
      )}
      {activeModal === `${projectId.toString()}-delete` && (
        <Modal label={`Delete project '${projectTitle}'`} close={closeModal}>
          <Flex direction='column' childrenGap='big' align='stretch'>
            <Warning text='Do you really want to delete the project?' />
            <Flex direction='row' justify='start' childrenGap='big'>
              <DestructiveButton
                label='Confirm delete'
                onClick={() => {
                  closeModal();
                  deleteProject(projectId);
                }}
              />
              <Button label='Cancel' onClick={closeModal} />
            </Flex>
          </Flex>
        </Modal>
      )}
    </ExpandableCard>
  );
};
