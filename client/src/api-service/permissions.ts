import { apiUrl } from './api-url';
import { makeOptionsObj } from './axios-auth-options';
import { PermissionOrderSet } from 'reminders-shared/sharedTypes';

import axios from 'axios';

const postPermissionsOrderSet = (orderSet: PermissionOrderSet, accessToken: string) => {
  const data = {
    orderSet,
  };
  return axios.post(`${apiUrl}/permissions`, data, makeOptionsObj(accessToken));
};

export { postPermissionsOrderSet };
