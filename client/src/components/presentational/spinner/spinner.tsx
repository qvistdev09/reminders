import { ReactNode } from 'react';
import { Flex } from '../containers/flex';
import Icon from '../icon/icon';
import { Text } from '../texts/text';
import './spinner.scss';

interface Props {
  children?: ReactNode;
}

export const Spinner = ({ children = 'Loading...' }: Props) => {
  return (
    <Flex childrenGap='small' justify='center'>
      <div className='spinner--rotate'>
        <Icon color='semiDark' icon='loading' size='small' />
      </div>
      <Text>{children}</Text>
    </Flex>
  );
};
