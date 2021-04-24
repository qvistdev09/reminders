import { useState } from 'react';
import { useProjects } from '../hooks/use-projects';
import { Button } from './presentational/button/button';
import { Form } from './presentational/containers/form';
import { LabelledInput } from './presentational/inputs/labelled-input';

export const ProjectCreator = () => {
  const { submitProject } = useProjects();
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
      <Button label='Create' btnStyle='action' onClick={() => {}} />
    </Form>
  );
};
