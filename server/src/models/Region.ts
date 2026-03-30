import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";
import sequelize from "../config/database";

class Region extends Model<
    InferAttributes<Region>,
    InferCreationAttributes<Region>
> {
    declare PropertyStateProvinceID: CreationOptional<number>;
    declare PropertyStateProvinceName: string;
}

Region.init(
    {
        PropertyStateProvinceID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        PropertyStateProvinceName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "Regions",
        timestamps: false,
    },
);

export default Region;
