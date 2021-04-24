import { ProjectObject } from 'reminders-shared/sharedTypes';
import Icon from './icon/icon';
import { ExpandableCard } from './presentational/containers/expandable-card';
import { ProjectTitle } from './presentational/headers/project-title';
import { LinkRow } from './presentational/links/link-row';
import { SmallText } from './presentational/texts/small-text';

interface Props {
  project: ProjectObject;
}

export const ProjectCard = ({ project }: Props) => {
  const { projectTitle, projectId } = project;
  const slug = `${projectTitle.toLowerCase().replace(/\s/g, '-')}_${projectId}`;

  const headerObj = (
    <LinkRow to={`/projects/${slug}`}>
      <Icon icon='open' color='primary' size='medium' />
      <ProjectTitle label={projectTitle} />
    </LinkRow>
  );
  const button = (
    <>
      <SmallText>Configure</SmallText>
      <Icon icon='chevronForward' color='semiDark' size='tiny' />
    </>
  );
  const buttonExpanded = (
    <>
      <SmallText>Configure</SmallText>
      <Icon icon='chevronDown' color='semiDark' size='tiny' />
    </>
  );

  return (
    <ExpandableCard headerObj={headerObj} button={button} buttonExpanded={buttonExpanded}>
      <p>{project.projectTitle}</p>
    </ExpandableCard>
  );
};
