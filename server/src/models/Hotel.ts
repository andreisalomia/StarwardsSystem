import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";
import sequelize from "../config/database";

class Hotel extends Model<
    InferAttributes<Hotel>,
    InferCreationAttributes<Hotel>
> {
    declare GlobalPropertyID: CreationOptional<number>;
    declare SourcePropertyID: string | null;
    declare GlobalPropertyName: string;
    declare GlobalChainCode: string | null;
    declare PropertyAddress1: string | null;
    declare PropertyAddress2: string | null;
    declare PrimaryAirportCode: string | null;
    declare CityID: number | null;
    declare PropertyStateProvinceID: number | null;
    declare PropertyZipPostal: string | null;
    declare PropertyPhoneNumber: string | null;
    declare PropertyFaxNumber: string | null;
    declare SabrePropertyRating: number | null;
    declare PropertyLatitude: number | null;
    declare PropertyLongitude: number | null;
    declare SourceGroupCode: string | null;
    declare GroupID: number | null;
    declare FloorsNumber: number | null;
    declare RoomsNumber: number | null;
    declare HotelStars: number | null;
    declare DistanceToAirport: number | null;
}

Hotel.init(
    {
        GlobalPropertyID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        SourcePropertyID: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        GlobalPropertyName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        GlobalChainCode: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        PropertyAddress1: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        PropertyAddress2: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        PrimaryAirportCode: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        CityID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: "Cities", key: "CityID" },
        },
        PropertyStateProvinceID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: "Regions", key: "PropertyStateProvinceID" },
        },
        PropertyZipPostal: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        PropertyPhoneNumber: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        PropertyFaxNumber: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        SabrePropertyRating: {
            type: DataTypes.DECIMAL(3, 1),
            allowNull: true,
        },
        PropertyLatitude: {
            type: DataTypes.DECIMAL(9, 6),
            allowNull: true,
        },
        PropertyLongitude: {
            type: DataTypes.DECIMAL(9, 6),
            allowNull: true,
        },
        SourceGroupCode: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        GroupID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: "HotelGroups", key: "GroupID" },
        },
        FloorsNumber: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        RoomsNumber: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        HotelStars: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        DistanceToAirport: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "Hotels",
        timestamps: false,
    },
);

export default Hotel;
