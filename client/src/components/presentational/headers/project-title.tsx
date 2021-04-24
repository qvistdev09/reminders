import './headers.scss';

interface Props {
  label: string;
}

export const ProjectTitle = ({ label }: Props) => {
  return <h3 className='headers__projecttitle'>{label}</h3>;
};
