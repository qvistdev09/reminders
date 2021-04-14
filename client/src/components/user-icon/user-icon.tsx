interface Props {
  firstName: string;
  lastName: string;
}

const UserIcon = ({ firstName = '', lastName = '' }: Props) => {
  const initials = firstName === '' || lastName === '' ? '?' : firstName[0] + lastName[0];
  return <div className='user-icon'>{initials}</div>;
};

export default UserIcon;
