import { apiUrl } from './api-url';
import { makeOptionsObj } from './axios-auth-options';
import axios from 'axios';
import { NewProjectFields, ProjectVisibility } from 'reminders-shared/sharedTypes';

const postNewProject = (project: NewProjectFields, accessToken: string) =>
  axios.post(`${apiUrl}/projects`, { project }, makeOptionsObj(accessToken));

const getUsersProjects = (accessToken: string) =>
  axios.get(`${apiUrl}/projects`, makeOptionsObj(accessToken));

const getSpecificProject = (projectId: string, accessToken?: string) => {
  const path = `${apiUrl}/projects/${projectId}`;
  if (accessToken) {
    return axios.get(path, makeOptionsObj(accessToken));
  }
  return axios.get(path);
};

const postNewVisibility = (projectId: string, projectVisibility: ProjectVisibility, accessToken: string) => {
  const path = `${apiUrl}/projects/${projectId}`;
  return axios.put(path, { project: { projectVisibility } }, makeOptionsObj(accessToken));
};

export { postNewProject, getUsersProjects, getSpecificProject, postNewVisibility };
