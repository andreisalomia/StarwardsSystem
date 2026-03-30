import express from "express";
import { sequelize, Hotel, Airport } from "./models";
import { seedHotels } from "./seed/seedHotels";
import { seedAirports } from "./seed/seedAirports";
import hotelRoutes from "./routes/hotelRoutes";

const app = express();
const port = process.env.PORT_SERVER || 3000;

async function start() {
    await sequelize.sync({ force: true });

    const hotelCount = await Hotel.count();
    if (hotelCount === 0) {
        console.log("Database empty, seeding hotels...");
        await seedHotels();
    } else {
        console.log(`Database already has ${hotelCount} hotels, skipping seed`);
    }

    const airportCount = await Airport.count();
    if (airportCount === 0) {
        console.log("No airports found, seeding airports...");
        await seedAirports();
    } else {
        console.log(`Database already has ${airportCount} airports, skipping seed`);
    }

    app.use(express.json());

    app.use("/hotels", hotelRoutes);

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

start().catch((err) => {
    console.error("Startup failed:", err);
    process.exit(1);
});