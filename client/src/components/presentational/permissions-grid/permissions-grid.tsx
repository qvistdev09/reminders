import './permissions-grid.scss';
import { PermissionOrder, UserInPermissionsGrid } from 'reminders-shared/sharedTypes';
import PermissionsRow from './permissions-row';

interface Props {
  permissions: UserInPermissionsGrid[];
  changePermission: (change: PermissionOrder) => void;
  owner?: UserInPermissionsGrid;
}

const PermissionsGrid = ({ permissions, owner, changePermission }: Props) => {
  const permissionsArray: UserInPermissionsGrid[] = owner ? [owner, ...permissions] : permissions;
  const base = 'permissions-grid__header-label permissions-grid__cell permissions-grid__header';
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
          isOwner={permission.uid === owner?.uid}
          changePermission={changePermission}
        />
      ))}
    </div>
  );
};

export default PermissionsGrid;
