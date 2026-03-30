import Hotel from "./Hotel";
import City from "./City";
import Region from "./Region";
import HotelGroup from "./HotelGroup";
import Airport from "./Airport";
import sequelize from "../config/database";

City.hasMany(Hotel, { foreignKey: "CityID" });
Hotel.belongsTo(City, { foreignKey: "CityID" });

Region.hasMany(Hotel, { foreignKey: "PropertyStateProvinceID" });
Hotel.belongsTo(Region, { foreignKey: "PropertyStateProvinceID" });

HotelGroup.hasMany(Hotel, { foreignKey: "GroupID" });
Hotel.belongsTo(HotelGroup, { foreignKey: "GroupID" });

City.hasMany(Airport, { foreignKey: "CityID" });
Airport.belongsTo(City, { foreignKey: "CityID" });

export { sequelize, Hotel, City, Region, HotelGroup, Airport };
