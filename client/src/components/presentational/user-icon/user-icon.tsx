import './user-icon.scss';

interface Props {
  firstName: string;
  lastName: string;
}

const UserIcon = ({ firstName = '', lastName = '' }: Props) => {
  const initials = firstName === '' || lastName === '' ? '?' : firstName[0] + lastName[0];
  return (
    <div className='user-icon'>
      <p className='user-icon__initials'>{initials}</p>
    </div>
  );
};

export default UserIcon;
