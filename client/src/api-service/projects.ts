import { apiUrl } from './api-url';
import { makeOptionsObj } from './axios-auth-options';
import axios from 'axios';
import { NewProjectFields, Ownership, ProjectVisibility } from 'reminders-shared/sharedTypes';

const projectsApi = {
  create(project: NewProjectFields, accessToken: string) {
    return axios.post(`${apiUrl}/projects`, { project }, makeOptionsObj(accessToken));
  },
  getAll(accessToken: string, ownership: Ownership) {
    return axios.get(`${apiUrl}/projects`, makeOptionsObj(accessToken, { ownership }));
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
