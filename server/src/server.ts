import express from "express";
import { sequelize, Hotel, Airport } from "./models";
import { seedHotels } from "./seed/seedHotels";
import { seedAirports } from "./seed/seedAirports";
import hotelRoutes from "./routes/hotelRoutes";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import { default as User } from "./models/User";
import { default as Permission } from "./models/Permission";
import bcrypt from "bcryptjs";

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
    app.use(cookieParser());

    app.use("/auth", authRoutes);

    app.use("/hotels", hotelRoutes);

    // seed permissions and an admin user if none exist
    const permCount = await Permission.count();
    if (permCount === 0) {
        console.log("Seeding default permissions...");
        const roles = ["Hotel Manager","Group Manager","Traveler","Administrator","Data Operator"];
        const resources = ["hotels","airports","users"];
        for (const role of roles) {
            for (const resource of resources) {
                await Permission.create({ role, resource, can_read: role === "Administrator" || role === "Data Operator", can_write: role === "Administrator" });
            }
        }
    }

    const adminCount = await User.count({ where: { role: "Administrator" } });
    if (adminCount === 0) {
        console.log("Seeding admin user (email: admin@example.com / password: admin123)...");
        const hash = await bcrypt.hash("admin123", 10);
        await User.create({ name: "Admin", email: "admin@example.com", password_hash: hash, role: "Administrator", hotel_id: null, group_id: null });
    }

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

start().catch((err) => {
    console.error("Startup failed:", err);
    process.exit(1);
});