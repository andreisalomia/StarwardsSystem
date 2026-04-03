import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Permission extends Model {
    declare id: number;
    declare role: string;
    declare resource: string;
    declare can_read: boolean;
    declare can_write: boolean;
}

Permission.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        role: { type: DataTypes.STRING, allowNull: false },
        resource: { type: DataTypes.STRING, allowNull: false },
        can_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        can_write: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    { sequelize, tableName: "Permissions" },
);

export default Permission;
