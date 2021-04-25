import { useState } from 'react';
import { useProjects } from '../hooks/use-projects';
import { Button } from './presentational/button/button';
import { Form } from './presentational/containers/form';
import { LabelledInput } from './presentational/inputs/labelled-input';
import { Spinner } from './presentational/spinner/spinner';

export const ProjectCreator = () => {
  const { submitProject, submittingProject } = useProjects();
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    submitProject(title);
    setTitle('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <LabelledInput
        value={title}
        onChange={setTitle}
        required={true}
        type='text'
        label='Project name'
        id='new-project-name'
        placeholder='Type project title here'
      />
      {submittingProject && <Spinner>Creating new project...</Spinner>}
      <Button label='Create' btnStyle='action' onClick={() => {}} />
    </Form>
  );
};
