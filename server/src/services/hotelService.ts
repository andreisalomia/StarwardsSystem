import { Hotel } from "../models";

export const findAllHotels = () => {
    return Hotel.findAll();
};

export const findHotelById = (id: number) => {
    return Hotel.findByPk(id);
};

export const createHotel = (data: Partial<Hotel>) => {
    return Hotel.create(data as Hotel);
};

export const updateHotel = async (id: number, data: Partial<Hotel>) => {
    const hotel = await Hotel.findByPk(id);
    if (!hotel) return null;
    return hotel.update(data);
};

export const deleteHotel = async (id: number) => {
    const hotel = await Hotel.findByPk(id);
    if (!hotel) return null;
    await hotel.destroy();
    return true;
};