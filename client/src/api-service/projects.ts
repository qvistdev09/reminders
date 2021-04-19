import { apiUrl } from './api-url';
import { makeOptionsObj } from './axios-auth-options';
import axios from 'axios';
import { NewProjectFields } from '../../../src/types/index';

const postNewProject = (project: NewProjectFields, accessToken: string) =>
  axios.post(`${apiUrl}/projects`, { project }, makeOptionsObj(accessToken));

const getUsersProjects = (accessToken: string) => axios.get(`${apiUrl}/projects`, makeOptionsObj(accessToken));

const getSpecificProject = (projectId: string, accesToken?: string) => {
  const path = `${apiUrl}/projects/${projectId}`;
  if (accesToken) {
    return axios.get(path, makeOptionsObj(accesToken));
  }
  return axios.get(path);
}

export { postNewProject, getUsersProjects, getSpecificProject };
