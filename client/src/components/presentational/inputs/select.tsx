interface Props {
  choices: { value: string; label: string }[];
  value: string;
  onChange: (str: string) => void;
}

export const Select = ({ choices, value, onChange }: Props) => {
  return (
    <div className='inputs__select-wrapper'>
      <select className='inputs__select' onChange={({ target: { value } }) => onChange(value)} value={value}>
        {choices.map(choice => (
          <option key={choice.value} value={choice.value}>
            {choice.label}
          </option>
        ))}
      </select>
    </div>
  );
};
