import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";
import sequelize from "../config/database";

class Review extends Model<
    InferAttributes<Review>,
    InferCreationAttributes<Review>
> {
    declare ReviewID: CreationOptional<number>;
    declare HotelID: number;
    declare Title: string | null;
    declare Text: string | null;
    declare Rating: number | null;
    declare PublishedDate: string | null;
}

Review.init(
    {
        ReviewID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        HotelID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "Hotels", key: "GlobalPropertyID" },
        },
        Title: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        Text: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        Rating: {
            type: DataTypes.DECIMAL(2, 1),
            allowNull: true,
        },
        PublishedDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "Reviews",
        timestamps: false,
    },
);

export default Review;
