import { SyntheticEvent } from 'react';
import { UserInPermissionsGrid } from '../../../../../src/types/index';

interface Props {
  data: UserInPermissionsGrid;
  final: boolean;
  changePermission: (change: UserInPermissionsGrid) => void;
}

const PermissionsRow = ({ data, final, changePermission }: Props) => {
  const { firstName, lastName, email, permissionRole } = data;

  const handleChange = (e: SyntheticEvent) => {
    console.log(e.target);
    e.preventDefault();
    if (e.target instanceof HTMLSelectElement) {
      console.log('here');
      if (e.target.value === 'editor' || e.target.value === 'viewer') {
        console.log(e.target.value);
        const newPermission: UserInPermissionsGrid = {
          ...data,
          permissionRole: e.target.value,
        };
        changePermission(newPermission);
      }
    }
  };

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
        <select
          className='form__input form__input-select'
          value={permissionRole}
          onChange={handleChange}
          disabled={permissionRole === 'Owner'}
        >
          {permissionRole === 'Owner' && <option value='owner'>Owner</option>}
          <option value='viewer'>Viewer</option>
          <option value='editor'>Editor</option>
        </select>
      </div>
    </>
  );
};

export default PermissionsRow;
