import { Model, Optional } from 'sequelize';
import { sequelize } from '../../config/db-config';
import { DataTypes } from 'sequelize';

interface PermissionAttributes {
  permissionId?: number;
  permissionUid: string;
  permissionRole: 'viewer' | 'editor';
}

interface PermissionCreationAttributes
  extends Optional<PermissionAttributes, 'permissionId'> {}

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
