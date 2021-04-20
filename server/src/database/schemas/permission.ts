import { Model, Optional } from 'sequelize';
import { sequelize } from '../../config/db-config';
import { DataTypes } from 'sequelize';
import { PermissionRole } from 'reminders-shared/sharedTypes';

interface PermissionAttributes {
  projectId?: number;
  permissionId?: number;
  permissionUid: string;
  permissionRole: PermissionRole;
}

interface PermissionCreationAttributes
  extends Optional<PermissionAttributes, 'permissionId'>,
    Optional<PermissionAttributes, 'projectId'> {}

export interface PermissionInstance
  extends Model<PermissionAttributes, PermissionCreationAttributes>,
    PermissionAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const Permission = sequelize.define<PermissionInstance>('Permission', {
  permissionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  permissionUid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  permissionRole: {
    type: DataTypes.ENUM('viewer', 'editor'),
    allowNull: false,
  },
});

export { Permission };
