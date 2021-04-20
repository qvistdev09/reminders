import { Request, Response } from 'express';
import { ProjectInstance } from '../database/schemas/project';
import { PermissionInstance } from '../database/schemas/permission';
import { Project, Permission } from '../database/root';
import { ControlledError } from './controlled-error';
import { PermissionRole, ProjectAccessResponse } from 'reminders-shared/sharedTypes';

class ProjectRequestHandler {
  req: Request | null;
  res: Response | null;
  uid: string | any;
  idParam: string | null;
  processed: {
    role: PermissionRole | 'none' | 'Owner' | null;
    projectId: number | null;
    project: ProjectInstance | null;
    permissions: PermissionInstance[] | null;
  };
  constructor(req: Request, res: Response) {
    this.req = req;
    this.res = res;
    this.uid = null;
    this.idParam = null;
    this.processed = {
      role: null,
      projectId: null,
      project: null,
      permissions: null,
    };
  }

  prepareNewRequest() {
    if (!this.req) {
      throw new ControlledError('Server functions called in wrong order', 500);
    }
    const { projectIdString } = this.req.params;
    let uid: string | null = null;
    if (this.req.jwt && this.req.jwt.claims.uid) {
      uid = this.req.jwt.claims.uid;
    }
    this.idParam = projectIdString;
    this.uid = uid;
    return this;
  }

  validateParam() {
    if (!this.idParam || typeof this.idParam !== 'string') {
      throw new ControlledError('Invalid project identifier', 400);
    }
    const parsedParam = parseInt(this.idParam, 10);
    if (isNaN(parsedParam)) {
      throw new ControlledError('Invalid project identifier', 400);
    }
    this.processed.projectId = parsedParam;
    return this;
  }

  async findProject() {
    try {
      if (!this.processed.projectId) {
        throw new ControlledError('No project identifier', 400);
      }
      const matchedProject = await Project.findOne({ where: { projectId: this.processed.projectId } });
      if (!matchedProject) {
        throw new ControlledError('Not found', 404);
      }
      this.processed.project = matchedProject;
      const permissions = await Permission.findAll({ where: { projectId: this.idParam } });
      this.processed.permissions = permissions;
      return this;
    } catch (err) {
      throw err;
    }
  }

  establishRole() {
    if (!this.processed.project || !this.processed.permissions) {
      throw new ControlledError('Server functions called in wrong order', 500);
    }
    if (!this.uid || typeof this.uid !== 'string') {
      this.processed.role = 'none';
      return this;
    }
    if (this.processed.project.projectOwner === this.uid) {
      this.processed.role = 'Owner';
      return this;
    }
    const { permissions } = this.processed;
    const matchedPermission = permissions.find(permission => permission.permissionUid === this.uid);
    if (!matchedPermission) {
      this.processed.role = 'none';
      return this;
    }
    this.processed.role = matchedPermission.permissionRole;
    return this;
  }

  sendResponse() {
    if (!this.processed.project || !this.processed.role || !this.res) {
      throw new ControlledError('Server functions called in wrong order', 500);
    }
    const visibility = this.processed.project.projectVisibility;
    const { role } = this.processed;

    const resObject: ProjectAccessResponse = {
      role,
      visibility,
    };

    this.res.json(resObject);
  }
}

export { ProjectRequestHandler };
