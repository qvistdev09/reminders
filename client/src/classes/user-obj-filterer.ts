import { UserObj, ProjectObject } from '../../../src/types/index';

class UserObjFilterer {
  userObjects: UserObj[] = [];
  constructor(userObjects: UserObj[]) {
    this.userObjects = userObjects;
  }

  removeSelected(selected: UserObj[]) {
    this.userObjects = this.userObjects.filter(user => {
      const match = selected.find(selectedUser => selectedUser.uid === user.uid);
      if (match) {
        return false;
      }
      return true;
    });
    return this;
  }

  filterBySearch(searchValue: string | undefined) {
    this.userObjects = this.userObjects.filter(user => {
      if (!searchValue) {
        return true;
      }
      const completeName = `${user.firstName} ${user.lastName}`;
      return new RegExp(searchValue, 'i').test(completeName);
    });
    return this;
  }

  removeOwner(ownerUid: string | undefined) {
    if (ownerUid) {
      this.userObjects = this.userObjects.filter(user => user.uid !== ownerUid);
    }
    return this;
  }

  removeUsersAlreadyInProject(projects: ProjectObject[], projectId: number) {
    const matchedProject = projects.find(project => project.projectId === projectId);
    if (!matchedProject) {
      return this;
    }
    this.userObjects = this.userObjects.filter(user => {
      const foundUser = matchedProject.permissions.find(permission => permission.uid === user.uid);
      if (foundUser) {
        return false;
      }
      return true;
    });
    return this;
  }

  limitResults(max: number) {
    if (this.userObjects.length <= max) {
      return this.userObjects;
    }
    return this.userObjects.slice(0, max);
  }
}

export { UserObjFilterer };
