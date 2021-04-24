import './button.scss';
import { getModifier } from '../../../modules/get-modifier';
import { makeClassname } from '../../../modules/make-classname';

interface Props {
  onClick: () => void;
  label: string;
  btnStyle?: 'action';
}

export const Button = ({ onClick, label, btnStyle }: Props) => {
  const baseClass = 'button';
  const modifier = getModifier('button', btnStyle);
  return (
    <button onClick={() => onClick()} className={makeClassname(baseClass, modifier)}>
      {label}
    </button>
  );
};
