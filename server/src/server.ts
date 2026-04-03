import express from "express";
import { sequelize, Hotel, Airport, Review, HotelRating } from "./models";
import { seedHotels } from "./seed/seedHotels";
import { seedAirports } from "./seed/seedAirports";
import hotelRoutes from "./routes/hotelRoutes";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import { default as User } from "./models/User";
import { default as Permission } from "./models/Permission";
import bcrypt from "bcryptjs";
import { seedReviews } from "./seed/seedReviews";
import { seedMetadata } from "./seed/seedMetadata";
import ratingRoutes from "./routes/ratingRoutes";
import userRoutes from "./routes/userRoutes";
import permissionRoutes from "./routes/permissionRoutes";

const app = express();
const port = process.env.PORT_SERVER || 3000;

async function start() {
    await sequelize.sync({ force: false });

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

    const ratingCount = await HotelRating.count();
    if (ratingCount === 0) {
        console.log("No metadata scores found, calculating...");
        await seedMetadata();
    } else {
        console.log(`Database already has ${ratingCount} hotel ratings, skipping`);
    }

    const reviewCount = await Review.count();
    if (reviewCount === 0) {
        console.log("No reviews found, seeding...");
        await seedReviews();
    } else {
        console.log(`Database already has ${reviewCount} reviews, skipping seed`);
    }

    // seed permissions and an admin user if none exist
    const permCount = await Permission.count();
    if (permCount === 0) {
        console.log("Seeding default permissions...");
        const roles = ["Hotel Manager", "Group Manager", "Traveler", "Administrator", "Data Operator"];
        const resources = ["hotels", "airports", "users"];
        for (const role of roles) {
            for (const resource of resources) {
                await Permission.create({
                    role,
                    resource,
                    can_read: role === "Administrator" || role === "Data Operator",
                    can_write: role === "Administrator",
                });
            }
        }
    }

    // Ensure Travelers can read hotels (allow browsing by travelers) — update or create regardless of existing perms
    try {
        const [travelerHotelPerm, created] = await Permission.findOrCreate({
            where: { role: "Traveler", resource: "hotels" },
            defaults: { can_read: true, can_write: false },
        });
        if (!created && !travelerHotelPerm.can_read) {
            await travelerHotelPerm.update({ can_read: true });
        }
    } catch (err) {
        console.error("Failed to ensure traveler hotel permission:", err);
    }

    // Ensure Hotel Manager and Group Manager can read hotels
    try {
        const rolesToEnsure = ["Hotel Manager", "Group Manager"];
        for (const r of rolesToEnsure) {
            const [perm, created2] = await Permission.findOrCreate({
                where: { role: r, resource: "hotels" },
                defaults: { can_read: true, can_write: false },
            });
            if (!created2 && !perm.can_read) {
                await perm.update({ can_read: true });
            }
        }
    } catch (err) {
        console.error("Failed to ensure manager hotel permissions:", err);
    }

    const adminCount = await User.count({ where: { role: "Administrator" } });
    if (adminCount === 0) {
        console.log("Seeding admin user (email: admin@example.com / password: admin123)...");
        const hash = await bcrypt.hash("admin123", 10);
        await User.create({
            name: "Admin",
            email: "admin@example.com",
            password_hash: hash,
            role: "Administrator",
            hotel_id: null,
            group_id: null,
        });
    }

    app.use(express.json());
    app.use(cookieParser());

    app.use("/api/hotels", ratingRoutes);
    app.use("/api/hotels", hotelRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/permissions", permissionRoutes);
    app.use("/auth", authRoutes);

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

start().catch((err) => {
    console.error("Startup failed:", err);
    process.exit(1);
});
