interface Props {
  onClick: () => void;
  label: string;
}

export const SettingsButton = ({ onClick, label }: Props) => {
  return (
    <button onClick={() => onClick()} className='button__settings'>
      {label}
    </button>
  );
};
