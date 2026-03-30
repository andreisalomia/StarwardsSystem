import fs from "fs";
import path from "path";
import { Hotel, City, Region } from "../models";

function parseCSV(filepath: string): Record<string, string>[] {
    const lines = fs.readFileSync(filepath, "utf-8").split("\n").filter((l) => l.trim());
    
    const headers = lines[0].split(";").map((h) => h.trim());

    return lines.slice(1).map((line) => {
        const values = line.split(";").map((v) => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((h, i) => {
            row[h] = values[i] ?? "";
        });
        return row;
    });
}

function toFloat(value: string): number | null {
    if (!value.trim()) return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
}

export async function seedHotels() {
    const csvPath = path.join(__dirname, "..", "..", "db", "data_clean.csv");
    const rows = parseCSV(csvPath);
    console.log(`Seeding ${rows.length} rows...`);

    const uniqueCities = new Set<string>();
    for (const row of rows) {
        const name = row["Property City Name"];
        const country = row["Property Country Code"];
        if (name) uniqueCities.add(`${name}|${country}`);
    }

    const cityMap = new Map<string, number>();
    for (const key of uniqueCities) {
        const [cityName, country] = key.split("|");
        const city = await City.create({
            CityName: cityName,
            Country: country,
        });
        cityMap.set(key, city.CityID as number);
    }
    console.log(`${cityMap.size} cities inserted`);

    const uniqueRegions = new Set<string>();
    for (const row of rows) {
        const region = row["Property State/Province"];
        if (region) uniqueRegions.add(region);
    }

    const regionMap = new Map<string, number>();
    for (const regionName of uniqueRegions) {
        const region = await Region.create({
            PropertyStateProvinceName: regionName,
        });
        regionMap.set(regionName, region.PropertyStateProvinceID as number);
    }
    console.log(`${regionMap.size} regions inserted`);

    let inserted = 0;
    let skipped = 0;

    for (const row of rows) {
        const globalID = parseInt(row["Global Property ID"], 10);
        if (isNaN(globalID)) {
            skipped++;
            continue;
        }

        const cityKey = `${row["Property City Name"]}|${row["Property Country Code"]}`;
        const cityID = cityMap.get(cityKey) || null;
        const regionID = row["Property State/Province"] ? (regionMap.get(row["Property State/Province"]) || null) : null;

        try {
            await Hotel.create({
                GlobalPropertyID: globalID,
                SourcePropertyID: row["Source Property ID"] || null,
                GlobalPropertyName: row["Global Property Name"] || "",
                GlobalChainCode: row["Global Chain Code"] || null,
                PropertyAddress1: row["Property Address 1"] || null,
                PropertyAddress2: row["Property Address 2"] || null,
                PrimaryAirportCode: row["Primary Airport Code"] || null,
                CityID: cityID,
                PropertyStateProvinceID: regionID,
                PropertyZipPostal: row["Property Zip/Postal"] || null,
                PropertyPhoneNumber: row["Property Phone Number"] || null,
                PropertyFaxNumber: row["Property Fax Number"] || null,
                SabrePropertyRating: toFloat(row["Sabre Property Rating"]),
                PropertyLatitude: toFloat(row["Property Latitude"]),
                PropertyLongitude: toFloat(row["Property Longitude"]),
                SourceGroupCode: row["Source Group Code"] || null,
            });
            inserted++;
        } catch (err) {
            skipped++;
        }
    }
    console.log(`${inserted} hotels inserted, ${skipped} skipped`);
}
