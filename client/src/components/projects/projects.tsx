import { SyntheticEvent, useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { postNewProject, getUsersProjects } from '../../api-service/projects';
import FormLabelledInput from '../form/elements/form-labelled-input';
import ProjectsRow from './elements/projects-row';
import { ProjectWithPermissions } from '../../../../src/api/services/permissions-service';
import Modal from '../modal/modal';
import ProjectsAddCollaborators from './elements/projects-add-collaborators';

const Projects = () => {
  const [newProjectName, setNewProjectName] = useState('');
  const [projects, setProjects] = useState([] as ProjectWithPermissions[]);
  const [permissionsModal, setPermissionsModal] = useState(false);
  const { authState } = useOktaAuth();

  const fetchProjects = () => {
    if (authState.accessToken) {
      const { accessToken } = authState.accessToken;
      getUsersProjects(accessToken)
        .then(({ data: { projects } }) => setProjects(projects))
        .catch(err => console.log(err.message));
    }
  };

  const showPermissionsModal = () => {
    setPermissionsModal(true);
    const html = document.querySelector('html');
    if (html) {
      html.style.overflow = 'hidden';
    }
  };

  useEffect(() => {
    if (authState.accessToken) {
      const { accessToken } = authState.accessToken;
      getUsersProjects(accessToken)
        .then(({ data: { projects } }) => setProjects(projects))
        .catch(err => console.log(err.message));
    }
  }, [authState.accessToken]);

  useEffect(() => {
    console.log(projects);
  }, [projects]);

  const newProjectSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      if (!authState.accessToken) {
        throw new Error('No authentication');
      }
      const { accessToken } = authState.accessToken;
      await postNewProject(
        {
          project: {
            projectTitle: newProjectName,
          },
        },
        accessToken
      );
      fetchProjects();
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
        {permissionsModal && (
          <Modal label='Add collaborators' close={() => setPermissionsModal(false)}>
            <ProjectsAddCollaborators />
          </Modal>
        )}
        <div className='projects__container'>
          {projects.map(data => (
            <ProjectsRow
              key={data.project.projectId}
              data={data}
              openModal={showPermissionsModal}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
