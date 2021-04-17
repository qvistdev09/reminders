import { PermissionInstanceWithName } from '../../../../../src/api/services/permissions-service';
import { PermissionOrder } from '../../../../../src/shared-types/permission-order';
import { OwnerRow } from '../permissions-grid';

interface Props {
  data: PermissionInstanceWithName | PermissionOrder | OwnerRow;
  final: boolean;
}

const RoleSelect = () => (
  <select className='form__input form__input-select'>
    <option value='viewer'>Viewer</option>
    <option value='editor'>Editor</option>
  </select>
);

const PermissionsRow = ({ data, final }: Props) => {
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
      <p className={`${cell} ${text} ${right}`}>
        <RoleSelect />
      </p>
    </>
  );
};

export default PermissionsRow;
