import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";
import sequelize from "../config/database";

class City extends Model<InferAttributes<City>, InferCreationAttributes<City>> {
    declare CityID: CreationOptional<number>;
    declare CityName: string;
    declare Country: string;
}

City.init(
    {
        CityID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        CityName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        Country: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "Cities",
        timestamps: false,
    },
);

export default City;
