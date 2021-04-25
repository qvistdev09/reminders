import { useState } from 'react';
import { Button } from './presentational/button/button';
import { Form } from './presentational/containers/form';
import { LabelledInput } from './presentational/inputs/labelled-input';

interface Props {
  onCreate: (str: string) => void;
}

export const TaskCreator = ({ onCreate }: Props) => {
  const [task, setTask] = useState('');

  const handleSubmit = () => {
    onCreate(task);
    setTask('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <LabelledInput
        value={task}
        onChange={setTask}
        required={true}
        type='text'
        label='Task title'
        id='new-task-name'
        placeholder='Type task title here'
      />
      <Button label='Create' btnStyle='action' onClick={() => {}} />
    </Form>
  );
};
