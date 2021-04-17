import { PermissionInstanceWithName } from '../../../../../src/api/services/permissions-service';
import { PermissionOrder } from '../../../../../src/shared-types/permission-order';

interface Props {
  data: PermissionInstanceWithName | PermissionOrder;
}

const PermissionsRow = ({ data }: Props) => {
  const { firstName, lastName, email } = data.userProfile;
  return (
    <>
      <p>{`${firstName} ${lastName}`}</p>
      <p>{email}</p>
      <p>{data.userPermission.permissionRole}</p>
    </>
  );
};

export default PermissionsRow;
