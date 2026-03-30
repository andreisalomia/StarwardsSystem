import fs from "fs";
import path from "path";
import { Airport, Hotel } from "../models";

import { parse } from "csv-parse/sync";

function parseCSV(filepath: string): Record<string, string>[] {
    const content = fs.readFileSync(filepath, "utf-8");
    return parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_quotes: true,
    });
}

function toFloat(value: string): number | null {
    if (!value.trim()) return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
}

function clean(value: string): string {
    return value.replace(/^"|"$/g, "").trim();
}

export async function seedAirports() {
    const csvPath = path.join(__dirname, "..", "..", "db", "world-airports.csv");
    const rows = parseCSV(csvPath);

    const largeAirports = rows.filter((r) => clean(r["type"]) === "large_airport" && clean(r["iata_code"]));
    console.log(`Seeding ${largeAirports.length} large airports`);

    const hotels = await Hotel.findAll({ attributes: ["PrimaryAirportCode", "CityID"] });

    const iataToCity = new Map<string, number>();
    for (const hotel of hotels) {
        if (hotel.PrimaryAirportCode && hotel.CityID) {
            iataToCity.set(hotel.PrimaryAirportCode.trim(), hotel.CityID);
        }
    }
    console.log(`${iataToCity.size} IATA codes found in hotels`);

    let inserted = 0;
    let skipped = 0;

    for (const row of largeAirports) {
        const iataCode = clean(row["iata_code"]);
        if (!iataCode) { skipped++; continue; }

        const cityID = iataToCity.get(iataCode) || null;

        try {
            await Airport.create({
                IATACode:    iataCode,
                AirportName: clean(row["name"]) || iataCode,
                CityID:      cityID,
                Latitude:    toFloat(row["latitude_deg"]),
                Longitude:   toFloat(row["longitude_deg"]),
            });
            inserted++;
        } catch (err) {
            skipped++;
        }
    }
    console.log(`${inserted} airports inserted, ${skipped} skipped`);
}