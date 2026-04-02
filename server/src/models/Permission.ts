import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Permission extends Model {
  public id!: number;
  public role!: string;
  public resource!: string;
  public can_read!: boolean;
  public can_write!: boolean;
}

Permission.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    role: { type: DataTypes.STRING, allowNull: false },
    resource: { type: DataTypes.STRING, allowNull: false },
    can_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    can_write: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { sequelize, tableName: "Permissions" }
);

export default Permission;
