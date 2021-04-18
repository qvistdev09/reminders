import { combineReducers } from 'redux';

import userDetails from './slices/user-details';
import projects from './slices/projects';

export default combineReducers({
  userDetails,
  projects,
});
