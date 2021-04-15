import { SyntheticEvent, useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { postNewProject, getUsersProjects } from '../../api-service/projects';
import FormLabelledInput from '../form/elements/form-labelled-input';

const Projects = () => {
  const [newProjectName, setNewProjectName] = useState('');
  const { authState } = useOktaAuth();

  useEffect(() => {
    if (authState.accessToken) {
      const { accessToken } = authState.accessToken;
      getUsersProjects(accessToken)
        .then(response => console.log(response))
        .catch(err => console.log(err.message));
    }
  }, [authState.accessToken]);

  const newProjectSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      if (!authState.accessToken) {
        throw new Error('No authentication');
      }
      const { accessToken } = authState.accessToken;
      const serverResponse = await postNewProject(
        {
          project: {
            projectTitle: newProjectName,
          },
        },
        accessToken
      );
      console.log(serverResponse);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='main__projects-container'>
      <div className='utility--darkened-column'>
        <h2 className='utility--feature-header '>Create new project</h2>
        <form className='form form--small-p' onSubmit={newProjectSubmit}>
          <FormLabelledInput
            value={newProjectName}
            onChange={setNewProjectName}
            required={true}
            type='text'
            label='Project name'
            id='new-project-name'
          />
          <button type='submit' className='form__submit-btn'>
            Create project
          </button>
        </form>
      </div>
      <div className='utility--border-right'>
        <h2 className='utility--feature-header'>Your projects</h2>
      </div>
    </div>
  );
};

export default Projects;
