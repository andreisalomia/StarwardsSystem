import { Hotel } from "../models";
import User from "../models/User";
import { WhereOptions, Op } from "sequelize";

export const findAllHotels = () => {
    return Hotel.findAll();
};

// Return hotels scoped to the requesting user
export const findHotelsForUser = async (user: any) => {
    // Administrator sees all
    if (!user || user.role === "Administrator") return Hotel.findAll();

    // Travelers and others: show all (or you can restrict further)
    if (user.role !== "Hotel Manager" && user.role !== "Group Manager") return Hotel.findAll();

    const where: WhereOptions = {};

    if (user.role === "Hotel Manager") {
        // show only the hotel assigned to the manager (use GlobalPropertyID PK)
        where["GlobalPropertyID"] = user.hotel_id;
        return Hotel.findAll({ where });
    }

    // Group Manager: show hotels that belong to the manager's group OR hotels whose assigned Hotel Managers have the same group_id
    if (user.role === "Group Manager") {
        // find hotel_ids managed by users in this group
        const managers = await User.findAll({ where: { role: "Hotel Manager", group_id: user.group_id }, attributes: ["hotel_id"] });
        const hotelIds = managers.map((m: any) => m.hotel_id).filter((id: any) => id != null);

        const orConditions: any[] = [];
        if (user.group_id != null) orConditions.push({ GroupID: user.group_id });
        if (hotelIds.length > 0) orConditions.push({ GlobalPropertyID: { [Op.in]: hotelIds } });

        if (orConditions.length === 0) return Hotel.findAll();
        return Hotel.findAll({ where: { [Op.or]: orConditions } });
    }

    // fallback: return all
    return Hotel.findAll();
};

export const findHotelById = (id: number) => {
    return Hotel.findOne({ where: { GlobalPropertyID: id } });
};

export const createHotel = (data: Partial<Hotel>) => {
    return Hotel.create(data as Hotel);
};

export const updateHotel = async (id: number, data: Partial<Hotel>) => {
    const hotel = await Hotel.findOne({ where: { GlobalPropertyID: id } });
    if (!hotel) return null;
    return hotel.update(data);
};

export const deleteHotel = async (id: number) => {
    const hotel = await Hotel.findOne({ where: { GlobalPropertyID: id } });
    if (!hotel) return null;
    await hotel.destroy();
    return true;
};