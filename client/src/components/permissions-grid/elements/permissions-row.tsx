import { PermissionInstanceWithName } from '../../../../../src/api/services/permissions-service';

interface Props {
  data: PermissionInstanceWithName;
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
