import fs from "fs";
import path from "path";
import { Review } from "../models";
import { parse } from "csv-parse/sync";

function parseCSV(filepath: string): Record<string, string>[] {
    const content = fs.readFileSync(filepath, "utf-8");
    return parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_quotes: true,
        delimiter: ";",
    });
}

function cleanText(value: string): string | null {
    if (!value.trim()) return null;
    return value.replace(/\r/g, "").trim();
}

function toFloat(value: string): number | null {
    if (!value.trim()) return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
}

export async function seedReviews() {
    const csvPath = path.join(__dirname, "..", "..", "db", "reviews.csv");
    const rows = parseCSV(csvPath);
    console.log(`Seeding ${rows.length} reviews...`);

    let inserted = 0;
    let skipped = 0;

    for (const row of rows) {
        const hotelID = parseInt(row["GlobalPropertyID"], 10);
        if (isNaN(hotelID)) {
            skipped++;
            continue;
        }

        try {
            await Review.create({
                HotelID: hotelID,
                Title: cleanText(row["Title"]),
                Text: cleanText(row["Text"]),
                Rating: toFloat(row["Rating"]),
                PublishedDate: row["PublishedDate"] || null,
            });
            inserted++;
        } catch (err) {
            skipped++;
        }
    }

    console.log(`${inserted} reviews inserted, ${skipped} skipped`);
}
