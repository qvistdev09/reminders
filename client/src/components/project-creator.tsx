import FormLabelledInput from './form/elements/form-labelled-input';
import { Button } from './presentational/button/button';
import { Form } from './presentational/containers/form';

export const ProjectCreator = () => {
  return (
    <Form onSubmit={() => {}}>
      <FormLabelledInput
        value='temp'
        onChange={() => {}}
        required={true}
        type='text'
        label='Project name'
        id='new-project-name'
      />
      <Button label='Create card' btnStyle='action' onClick={() => {}} />
    </Form>
  );
};
