import { PermissionInstanceWithName } from '../../../../src/api/services/permissions-service';
import { PermissionOrder } from '../../../../src/shared-types/permission-order';
import PermissionsRow from './elements/permissions-row';
import { useAppUserDetails } from '../../hooks/use-app-user-details';

interface Props {
  permissions: PermissionInstanceWithName[] | PermissionOrder[];
  showOwner: boolean;
}

export interface OwnerRow {
  userProfile: {
    firstName: string;
    lastName: string;
    uid: string;
    email: string;
  };
  userPermission: {
    permissionRole: 'Owner';
  };
}

const PermissionsGrid = ({ permissions, showOwner = false }: Props) => {
  const owner = useAppUserDetails();

  const permissionsArray =
    showOwner && owner.retrieved
      ? [
          {
            userProfile: {
              firstName: owner.firstName,
              lastName: owner.lastName,
              uid: owner.uid,
              email: owner.email,
            },
            userPermission: {
              permissionRole: 'Owner',
            },
          } as OwnerRow,
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
      {permissionsArray.map(
        (
          permission: PermissionInstanceWithName | PermissionOrder | OwnerRow,
          index: number
        ) => (
          <PermissionsRow
            key={permission.userProfile.uid}
            data={permission}
            final={index === permissionsArray.length - 1}
          />
        )
      )}
    </div>
  );
};

export default PermissionsGrid;
