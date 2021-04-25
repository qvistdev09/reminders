import { Text } from '../texts/text';
import './messages.scss';

interface Props {
  text: string;
}

export const Warning = ({ text }: Props) => {
  return (
    <div className='messages__warning'>
      <Text mood='warning' size='normal' weight='strong'>
        {text}
      </Text>
    </div>
  );
};
