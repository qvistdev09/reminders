import { SyntheticEvent } from 'react';
import { UserInPermissionsGrid } from '../../../../../src/types/index';

interface Props {
  data: UserInPermissionsGrid;
  final: boolean;
}

const PermissionsRow = ({ data, final }: Props) => {
  const { firstName, lastName, email, permissionRole } = data;

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
        {permissionRole === 'Owner' ? (
          'Owner'
        ) : (
          <select className='form__input form__input-select' value={permissionRole}>
            <option value='Viewer'>Viewer</option>
            <option value='Editor'>Editor</option>
          </select>
        )}
      </div>
    </>
  );
};

export default PermissionsRow;
