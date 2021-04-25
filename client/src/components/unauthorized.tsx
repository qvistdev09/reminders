import { Flex } from './presentational/containers/flex';
import { Warning } from './presentational/messages/warning';

export const Unauthorized = () => {
  return (
    <Flex justify='center' flex={1} align='start'>
      <Flex maxWidth='appMaxWidth' justify='center' align='start' yPadding={0} xPadding={1}>
        <Warning text='This project is not publicly accessible' />
      </Flex>
    </Flex>
  );
};
