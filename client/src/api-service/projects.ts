import { apiUrl } from './api-url';
import { makeOptionsObj } from './axios-auth-options';
import axios from 'axios';

interface NewProject {
  project: {
    projectTitle: string;
  };
}

const postNewProject = (projectDetails: NewProject, accessToken: string) =>
  axios.post(`${apiUrl}/projects`, projectDetails, makeOptionsObj(accessToken));

const getUsersProjects = (accessToken: string) =>
  axios.get(`${apiUrl}/projects`, makeOptionsObj(accessToken));

export { postNewProject, getUsersProjects };
