import './headers.scss';

interface Props {
  label: string;
}

export const SettingsHeader = ({ label }: Props) => {
  return <h4 className='headers__settings'>{label}</h4>;
};
