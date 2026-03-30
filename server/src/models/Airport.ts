import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";
import sequelize from "../config/database";

class Airport extends Model<
    InferAttributes<Airport>,
    InferCreationAttributes<Airport>
> {
    declare AirportID: CreationOptional<number>;
    declare IATACode: string;
    declare AirportName: string;
    declare CityID: number | null;
    declare Latitude: number | null;
    declare Longitude: number | null;
}

Airport.init(
    {
        AirportID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        IATACode: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
        },
        AirportName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        CityID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: "Cities", key: "CityID" },
        },
        Latitude: {
            type: DataTypes.DECIMAL(9, 6),
            allowNull: true,
        },
        Longitude: {
            type: DataTypes.DECIMAL(9, 6),
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "Airports",
        timestamps: false,
    },
);

export default Airport;
