import { combineReducers } from 'redux';

import userDetails from './slices/user-details';
import projects from './slices/projects';
import modal from './slices/modal';

export default combineReducers({
  userDetails,
  projects,
  modal,
});
