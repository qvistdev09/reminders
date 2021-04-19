import { Response } from 'express';
import { ProjectInstance } from '../database/schemas/project';
import { PermissionInstance } from '../database/schemas/permission';
import { Project, Permission } from '../database/root';
import RequestJwt from '../types/request-jwt';
import { ControlledError } from './controlled-error';
import { PermissionRole, ProjectVisibility } from '../types';

class ProjectRequestHandler {
  req: RequestJwt | null;
  res: Response | null;
  uid: string | any;
  idParam: string | null;
  processed: {
    role: PermissionRole | 'none' | null;
    projectId: number | null;
    project: ProjectInstance | null;
    permissions: PermissionInstance[] | null;
  };
  constructor() {
    this.req = null;
    this.res = null;
    this.uid = null;
    this.idParam = null;
    this.processed = {
      role: null,
      projectId: null,
      project: null,
      permissions: null,
    };
  }

  clearAll() {
    this.req = null;
    this.res = null;
    this.uid = null;
    this.processed = {
      role: null,
      projectId: null,
      project: null,
      permissions: null,
    };
  }

  prepareNewRequest(req: RequestJwt, res: Response) {
    this.clearAll();

    const { projectIdString } = req.params;
    let uid: any = null;
    if (req.jwt && req.jwt.claims.uid) {
      uid = req.jwt.claims.uid;
    }
    this.req = req;
    this.res = res;
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
    this.res.json({
      visibility,
      role,
    });
  }
}

export { ProjectRequestHandler };
