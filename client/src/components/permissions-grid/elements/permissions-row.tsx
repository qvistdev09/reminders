import { SyntheticEvent } from 'react';
import { PermissionInstanceWithName } from '../../../../../src/api/services/permissions-service';
import { PermissionOrder } from '../../../../../src/types/permission-order';
import { OwnerRow } from '../permissions-grid';

interface Props {
  data: PermissionInstanceWithName | PermissionOrder | OwnerRow;
  final: boolean;
  roleChange: (newRole: string, uid: string) => void;
}

const PermissionsRow = ({ data, final, roleChange }: Props) => {
  const { firstName, lastName, email } = data.userProfile;

  const finalModifier = final ? '-final' : '';

  // classes abbreviations
  const cell = 'permissions-grid__cell permissions-grid__cell-light';
  const text = 'permissions-grid__content-text';
  const left = 'permissions-grid__content-left' + finalModifier;
  const middle = 'permissions-grid__content-middle' + finalModifier;
  const right = 'permissions-grid__content-right' + finalModifier;

  return (
    <>
      <p className={`${cell} ${text} ${left}`}>{`${firstName} ${lastName}`}</p>
      <p className={`${cell} ${text} ${middle}`}>{email}</p>
      <div className={`${cell} ${text} ${right}`}>
        {data.userPermission.permissionRole === 'Owner' ? (
          'Owner'
        ) : (
          <select
            className='form__input form__input-select'
            value={data.userPermission.permissionRole}
            onChange={(e: SyntheticEvent) => {
              if (e.target instanceof HTMLInputElement) {
                roleChange(e.target.value, data.userProfile.uid);
              }
            }}
          >
            <option value='Viewer'>Viewer</option>
            <option value='Editor'>Editor</option>
          </select>
        )}
      </div>
    </>
  );
};

export default PermissionsRow;
