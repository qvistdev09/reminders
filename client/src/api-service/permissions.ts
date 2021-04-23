import { apiUrl } from './api-url';
import { makeOptionsObj } from './axios-auth-options';
import { PermissionOrderSet } from 'reminders-shared/sharedTypes';

import axios from 'axios';

const permissionsApi = {
  postOrderSet: (orderSet: PermissionOrderSet, accessToken: string) => {
    const data = {
      orderSet,
    };
    return axios.post(`${apiUrl}/permissions`, data, makeOptionsObj(accessToken));
  },
};

export { permissionsApi };
