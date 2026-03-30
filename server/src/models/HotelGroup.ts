import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";
import sequelize from "../config/database";

class HotelGroup extends Model<
    InferAttributes<HotelGroup>,
    InferCreationAttributes<HotelGroup>
> {
    declare GroupID: CreationOptional<number>;
    declare GroupName: string;
}

HotelGroup.init(
    {
        GroupID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        GroupName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "HotelGroups",
        timestamps: false,
    },
);

export default HotelGroup;
