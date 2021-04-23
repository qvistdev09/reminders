import { SyntheticEvent } from 'react';
import { PermissionOrder, UserInPermissionsGrid } from 'reminders-shared/sharedTypes';

interface Props {
  data: UserInPermissionsGrid;
  final: boolean;
  isOwner: boolean;
  changePermission: (change: PermissionOrder) => void;
}

const PermissionsRow = ({ data, final, isOwner, changePermission }: Props) => {
  const { firstName, lastName, email, permissionRole } = data;

  const handleChange = (e: SyntheticEvent) => {
    e.preventDefault();
    if (e.target instanceof HTMLSelectElement) {
      if (e.target.value === 'editor' || e.target.value === 'viewer') {
        const newPermission: PermissionOrder = {
          permissionRole: e.target.value,
          permissionUid: data.uid,
        };
        changePermission(newPermission);
      }
    }
  };

  const finalModifier = final ? '-final' : '';
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
        <select
          className='form__input form__input-select'
          value={isOwner ? 'Owner' : permissionRole}
          onChange={handleChange}
          disabled={isOwner}
        >
          {isOwner && <option value='owner'>Owner</option>}
          <option value='viewer'>Viewer</option>
          <option value='editor'>Editor</option>
        </select>
      </div>
    </>
  );
};

export default PermissionsRow;
