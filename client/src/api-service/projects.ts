import { apiUrl } from './api-url';
import { makeOptionsObj } from './axios-auth-options';
import axios from 'axios';
import { NewProjectFields } from '../../../src/types/index';

const postNewProject = (project: NewProjectFields, accessToken: string) =>
  axios.post(`${apiUrl}/projects`, { project }, makeOptionsObj(accessToken));

const getUsersProjects = (accessToken: string) => axios.get(`${apiUrl}/projects`, makeOptionsObj(accessToken));

export { postNewProject, getUsersProjects };
