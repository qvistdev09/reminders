import { Link } from 'react-router-dom';
import { ProjectObject } from 'reminders-shared/sharedTypes';
import { useAppUserDetails } from '../hooks/use-app-user-details';

interface Props {
  project: ProjectObject;
}

const SharedProject = ({ project }: Props) => {
  const appUser = useAppUserDetails();
  const matchedPermission = project.permissions.find(permission => permission.uid === appUser.uid);
  const { projectTitle, projectId, projectOwner } = project;
  // code repetition, move slug formatter into modules
  const slug = `${projectTitle.toLowerCase().replace(/\s/g, '-')}_${projectId}`;
  return (
    <div>
      <p>
        <Link to={slug}>{projectTitle}</Link>
      </p>
      <p>Owned by</p>
      <p>{`${projectOwner.firstName} ${projectOwner.lastName}`}</p>
      <p>Your role</p>
      <p>{matchedPermission?.permissionRole}</p>
    </div>
  );
};

export default SharedProject;
