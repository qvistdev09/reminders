import { LiveUserPublicIdentity } from 'reminders-shared/sharedTypes';
import { Flex } from './containers/flex';
import { Text } from './texts/text';
import UserIcon from './user-icon/user-icon';

interface Props {
  user: LiveUserPublicIdentity;
}

export const Collaborator = ({ user }: Props) => {
  return (
    <Flex flex={1} childrenGap='big'>
      <UserIcon firstName={user.fullName.split(' ')[0]} lastName={user.fullName.split(' ')[1]} />
      <Flex flex={1} justify='between'>
        <Text weight='strong'>{user.fullName}</Text>
        <Text size='small'>{user.role.toLowerCase()}</Text>
      </Flex>
    </Flex>
  );
};
