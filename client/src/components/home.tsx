import Icon from './icon/icon';
import { Card } from './presentational/containers/card';
import { Flex } from './presentational/containers/flex';
import { Text } from './presentational/texts/text';

export const Home = () => {
  return (
    <Flex justify='center' flex={1} align='start'>
      <Flex maxWidth='appMaxWidth' justify='center' align='start' yPadding={0} xPadding={1}>
        <Card header='Reminders' flex={1} cardMax={30}>
          <Flex direction='column' childrenGap='big' align='stretch'>
            <Text size='normal'>Welcome to Reminders!</Text>
            <Text size='normal'>Sign up and create an account to:</Text>
            <Flex childrenGap='big' justify='start'>
              <Icon icon='heart' color='primary' size='medium' />
              <Text size='normal' weight='strong'>Create to-do-lists</Text>
            </Flex>
            <Flex childrenGap='big' justify='start'>
              <Icon icon='heart' color='primary' size='medium' />
              <Text size='normal' weight='strong'>Collaborate with your friends in real-time</Text>
            </Flex>
            <Flex childrenGap='big' justify='start'>
              <Icon icon='heart' color='primary' size='medium' />
              <Text size='normal' weight='strong'>Share your lists with others</Text>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
};
