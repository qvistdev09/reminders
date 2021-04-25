import { Button } from './presentational/button/button';
import { Flex } from './presentational/containers/flex';
import { Text } from './presentational/texts/text';

interface Props {
  currentFilter: string;
  nextFilter: () => void;
}

export const TaskFilterer = ({ currentFilter, nextFilter }: Props) => {
  return (
    <Flex justify='end'>
      <Button
        label={
          <Flex childrenGap='small'>
            <Text>view: </Text>
            <Text weight='strong'>{currentFilter}</Text>
          </Flex>
        }
        onClick={nextFilter}
      />
    </Flex>
  );
};
