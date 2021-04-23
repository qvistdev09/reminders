import { apiUrl } from './api-url';
import { makeOptionsObj } from './axios-auth-options';
import axios from 'axios';
import { NewProjectFields, ProjectVisibility } from 'reminders-shared/sharedTypes';

const projectsApi = {
  create(project: NewProjectFields, accessToken: string) {
    return axios.post(`${apiUrl}/projects`, { project }, makeOptionsObj(accessToken));
  },
  getAll(accessToken: string) {
    return axios.get(`${apiUrl}/projects`, makeOptionsObj(accessToken));
  },
  getOne(projectId: string, accessToken?: string) {
    const path = `${apiUrl}/projects/${projectId}`;
    if (accessToken) {
      return axios.get(path, makeOptionsObj(accessToken));
    }
    return axios.get(path);
  },
  changeVisibility(projectId: string, projectVisibility: ProjectVisibility, accessToken: string) {
    const path = `${apiUrl}/projects/${projectId}`;
    return axios.put(path, { project: { projectVisibility } }, makeOptionsObj(accessToken));
  },
  delete(projectId: string, accessToken: string) {
    const path = `${apiUrl}/projects/${projectId}`;
    return axios.delete(path, makeOptionsObj(accessToken));
  },
};

export { projectsApi };
