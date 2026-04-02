import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
} from "sequelize";
import sequelize from "../config/database";

class HotelRating extends Model<
    InferAttributes<HotelRating>,
    InferCreationAttributes<HotelRating>
> {
    declare HotelID: number;
    declare AmenitiesRate: number | null;
    declare CleanlinessRate: number | null;
    declare FoodBeverage: number | null;
    declare SleepQuality: number | null;
    declare InternetQuality: number | null;
    declare MetadataScore: number | null;
    declare FinalScore: number | null;
    declare ReviewCount: number;
    declare CalculatedAt: string;
}

HotelRating.init(
    {
        HotelID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: { model: "Hotels", key: "GlobalPropertyID" },
        },
        AmenitiesRate: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
        },
        CleanlinessRate: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
        },
        FoodBeverage: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
        },
        SleepQuality: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
        },
        InternetQuality: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
        },
        MetadataScore: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
        },
        FinalScore: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
        },
        ReviewCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        CalculatedAt: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "HotelRatings",
        timestamps: false,
    },
);

export default HotelRating;
