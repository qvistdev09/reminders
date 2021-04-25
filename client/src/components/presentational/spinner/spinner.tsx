import { ReactNode } from 'react';
import { Flex } from '../containers/flex';
import Icon from '../icon/icon';
import { Text } from '../texts/text';
import './spinner.scss';

interface Props {
  children?: ReactNode;
  justify?: 'start' | 'center';
}

export const Spinner = ({ children = 'Loading...', justify = 'start' }: Props) => {
  return (
    <Flex childrenGap='small' justify={justify}>
      <div className='spinner--rotate'>
        <Icon color='semiDark' icon='loading' size='small' />
      </div>
      <Text>{children}</Text>
    </Flex>
  );
};
