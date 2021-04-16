import { PermissionInstanceWithName } from '../../../../src/api/services/permissions-service';
import PermissionsRow from './elements/permissions-row';

interface Props {
  permissions: PermissionInstanceWithName[];
}

const PermissionsGrid = ({ permissions }: Props) => {
  return (
    <div className='permissions-grid'>
      <p className='permissions-grid__header-label permissions-grid__cell permissions-grid__header permissions-grid__header-left'>
        Name
      </p>
      <p className='permissions-grid__header-label permissions-grid__cell permissions-grid__header permissions-grid__header-middle'>
        E-mail
      </p>
      <p className='permissions-grid__header-label permissions-grid__cell permissions-grid__header permissions-grid__header-right'>
        Role
      </p>
      <p className='permissions-grid__content-text permissions-grid__cell permissions-grid__cell-light permissions-grid__content-last-left'>
        You
      </p>
      <p className='permissions-grid__content-text permissions-grid__cell permissions-grid__cell-light permissions-grid__content-last-middle'>
        sven@example.com
      </p>
      <p className='permissions-grid__content-text permissions-grid__cell permissions-grid__cell-light permissions-grid__content-last-right'>
        owner
      </p>
      {permissions.map(data => (
        <PermissionsRow key={data.userPermission.permissionId} data={data} />
      ))}
    </div>
  );
};

export default PermissionsGrid;
