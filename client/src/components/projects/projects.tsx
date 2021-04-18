import { SyntheticEvent, useState } from 'react';
import FormLabelledInput from '../form/elements/form-labelled-input';
import ProjectsRow from './elements/projects-row';
import Modal from '../modal/modal';
import ProjectsAddCollaborators from './elements/projects-add-collaborators';
import { useProjects } from '../../hooks/use-projects';

const Projects = () => {
  const [newProjectName, setNewProjectName] = useState('');
  const { projects, submitProject } = useProjects();
  const [permissionsModal, setPermissionsModal] = useState(false);
  const [projectInEdit, setProjectInEdit] = useState(null as null | number);

  const showPermissionsModal = (projectId: number) => {
    setProjectInEdit(projectId);
    setPermissionsModal(true);
    const html = document.querySelector('html');
    if (html) {
      html.style.overflow = 'hidden';
    }
  };

  const closePermissionsModal = () => {
    setProjectInEdit(null);
    setPermissionsModal(false);
  };

  const newProjectSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    submitProject(newProjectName);
    setNewProjectName('');
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
        {permissionsModal && projectInEdit && (
          <Modal label='Add collaborators' close={closePermissionsModal}>
            <ProjectsAddCollaborators projectId={projectInEdit} />
          </Modal>
        )}
        <div className='projects__container'>
          {projects.map(data => (
            <ProjectsRow key={data.projectId} data={data} openModal={showPermissionsModal} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
