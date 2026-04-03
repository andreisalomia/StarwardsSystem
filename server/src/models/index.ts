import Hotel from "./Hotel";
import City from "./City";
import Region from "./Region";
import HotelGroup from "./HotelGroup";
import Airport from "./Airport";
import sequelize from "../config/database";
import User from "./User";
import Permission from "./Permission";
import Review from "./Review";
import HotelRating from "./HotelRating";

City.hasMany(Hotel, { foreignKey: "CityID" });
Hotel.belongsTo(City, { foreignKey: "CityID" });

Region.hasMany(Hotel, { foreignKey: "PropertyStateProvinceID" });
Hotel.belongsTo(Region, { foreignKey: "PropertyStateProvinceID" });

HotelGroup.hasMany(Hotel, { foreignKey: "GroupID" });
Hotel.belongsTo(HotelGroup, { foreignKey: "GroupID" });

City.hasMany(Airport, { foreignKey: "CityID" });
Airport.belongsTo(City, { foreignKey: "CityID" });

Hotel.hasMany(Review, { foreignKey: "HotelID" });
Review.belongsTo(Hotel, { foreignKey: "HotelID" });

Hotel.hasOne(HotelRating, { foreignKey: "HotelID" });
HotelRating.belongsTo(Hotel, { foreignKey: "HotelID" });

export { sequelize, Hotel, City, Region, HotelGroup, Airport, User, Permission, Review, HotelRating };