import { UserInPermissionsGrid } from 'reminders-shared/sharedTypes';
import PermissionsRow from './elements/permissions-row';
import { useAppUserDetails } from '../../hooks/use-app-user-details';

interface Props {
  permissions: UserInPermissionsGrid[];
  showOwner: boolean;
  changePermission: (change: UserInPermissionsGrid) => void;
}

const PermissionsGrid = ({ permissions, showOwner = false, changePermission }: Props) => {
  const owner = useAppUserDetails();

  const permissionsArray: UserInPermissionsGrid[] =
    showOwner && owner.retrieved
      ? [
          {
            firstName: owner.firstName,
            lastName: owner.lastName,
            email: owner.email,
            uid: owner.uid,
            permissionRole: 'Owner',
          },
          ...permissions,
        ]
      : permissions;

  // header classes short forms
  const base =
    'permissions-grid__header-label permissions-grid__cell permissions-grid__header';
  const left = 'permissions-grid__header-left';
  const middle = 'permissions-grid__header-middle';
  const right = 'permissions-grid__header-right';

  return (
    <div className='permissions-grid'>
      <p className={`${base} ${left}`}>Name</p>
      <p className={`${base} ${middle}`}>E-mail</p>
      <p className={`${base} ${right}`}>Role</p>
      {permissionsArray.map((permission, index) => (
        <PermissionsRow
          key={permission.uid}
          data={permission}
          final={index === permissionsArray.length - 1}
          changePermission={changePermission}
        />
      ))}
    </div>
  );
};

export default PermissionsGrid;
