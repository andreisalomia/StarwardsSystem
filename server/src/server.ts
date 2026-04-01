import express from "express";
import { sequelize, Hotel, Airport, Review, HotelRating } from "./models";
import { seedHotels } from "./seed/seedHotels";
import { seedAirports } from "./seed/seedAirports";
import hotelRoutes from "./routes/hotelRoutes";
import { seedReviews } from "./seed/seedReviews";
import { seedMetadata } from "./seed/seedMetadata";
import ratingRoutes from "./routes/ratingRoutes";

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
        console.log(
            `Database already has ${airportCount} airports, skipping seed`,
        );
    }

    const ratingCount = await HotelRating.count();
    if (ratingCount === 0) {
        console.log("No metadata scores found, calculating...");
        await seedMetadata();
    } else {
        console.log(
            `Database already has ${ratingCount} hotel ratings, skipping`,
        );
    }

    const reviewCount = await Review.count();
    if (reviewCount === 0) {
        console.log("No reviews found, seeding...");
        await seedReviews();
    } else {
        console.log(
            `Database already has ${reviewCount} reviews, skipping seed`,
        );
    }

    app.use(express.json());

    app.use("/hotels", ratingRoutes);
    app.use("/hotels", hotelRoutes);

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

start().catch((err) => {
    console.error("Startup failed:", err);
    process.exit(1);
});
