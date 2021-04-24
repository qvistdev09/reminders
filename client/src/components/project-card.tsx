import { ProjectObject, UserInPermissionsGrid } from 'reminders-shared/sharedTypes';
import { useAppUserDetails } from '../hooks/use-app-user-details';
import Icon from './icon/icon';
import { SettingsButton } from './presentational/button/settings-button';
import { ExpandableCard } from './presentational/containers/expandable-card';
import { Flex } from './presentational/containers/flex';
import { ProjectTitle } from './presentational/headers/project-title';
import { SettingsHeader } from './presentational/headers/settings-header';
import { LinkRow } from './presentational/links/link-row';
import PermissionsGrid from './presentational/permissions-grid/permissions-grid';
import { SmallText } from './presentational/texts/small-text';

interface Props {
  project: ProjectObject;
}

export const ProjectCard = ({ project }: Props) => {
  const { projectTitle, projectId, permissions } = project;
  const appUser = useAppUserDetails();
  const slug = `${projectTitle.toLowerCase().replace(/\s/g, '-')}_${projectId}`;

  const ownerObj: UserInPermissionsGrid = {
    firstName: appUser.firstName,
    lastName: appUser.lastName,
    email: appUser.email,
    uid: appUser.uid,
    permissionRole: 'editor',
  };

  const headerObj = (
    <LinkRow to={`/projects/${slug}`}>
      <Icon icon='open' color='primary' size='medium' />
      <ProjectTitle label={projectTitle} />
    </LinkRow>
  );
  const button = (
    <>
      <SmallText>Configure</SmallText>
      <Icon icon='chevronForward' color='semiDark' size='tiny' />
    </>
  );
  const buttonExpanded = (
    <>
      <SmallText>Configure</SmallText>
      <Icon icon='chevronDown' color='semiDark' size='tiny' />
    </>
  );

  return (
    <ExpandableCard headerObj={headerObj} button={button} buttonExpanded={buttonExpanded}>
      <Flex direction='column' align='stretch' childrenGap='small'>
        <Flex direction='row' justify='between' align='center'>
          <SettingsHeader label='Permissions' />
          <SettingsButton label='Add' onClick={() => {}} />
        </Flex>
        <PermissionsGrid permissions={permissions} changePermission={() => {}} owner={ownerObj} />
      </Flex>
    </ExpandableCard>
  );
};
