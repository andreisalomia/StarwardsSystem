import { getDistance } from "geolib";
import { Hotel, Airport, HotelRating } from "../models";

const DEFAULT_FLOORS = 5;
const DEFAULT_ROOMS = 100;
// weights pentru metadate
const WEIGHT_STARS = 0.4;
const WEIGHT_DISTANCE = 0.3;
const WEIGHT_ROOMS = 0.15;
const WEIGHT_FLOORS = 0.15;

// TODO: la rooms si floors am lasat valori random pentru moment

function normalizeDistance(distanceKm: number): number {
    // 5 puncte pentru 0km, 1 punct pentru 50km sau mai mult
    const clamped = Math.min(distanceKm, 50);
    return 5 - (clamped / 50) * 4;
}

function normalizeStars(stars: number): number {
    // extra check pentru stars ca sunt intre 1 si 5
    return Math.min(Math.max(stars, 1), 5);
}

async function findNearestAirportDistance(
    hotel: Hotel,
    airports: Airport[],
): Promise<number | null> {
    if (!hotel.PropertyLatitude || !hotel.PropertyLongitude) return null;

    const hotelCoords = {
        latitude: Number(hotel.PropertyLatitude),
        longitude: Number(hotel.PropertyLongitude),
    };

    // 1. cauta aeroportul din acelasi oras
    const cityAirport = airports.find(
        (a) => a.CityID === hotel.CityID && a.Latitude && a.Longitude,
    );
    if (cityAirport) {
        const dist =
            getDistance(hotelCoords, {
                latitude: Number(cityAirport.Latitude),
                longitude: Number(cityAirport.Longitude),
            }) / 1000;
        return Math.round(dist * 100) / 100;
    }

    // 2. fallback: cel mai apropiat aeroport din toate
    let minDistance = Infinity;
    for (const airport of airports) {
        if (!airport.Latitude || !airport.Longitude) continue;
        const dist =
            getDistance(hotelCoords, {
                latitude: Number(airport.Latitude),
                longitude: Number(airport.Longitude),
            }) / 1000;
        if (dist < minDistance) minDistance = dist;
    }

    return minDistance !== Infinity
        ? Math.round(minDistance * 100) / 100
        : null;
}

export async function seedMetadata() {
    const hotels = await Hotel.findAll();
    const airports = await Airport.findAll();
    console.log(`Calculating metadata for ${hotels.length} hotels...`);

    let updated = 0;
    let skipped = 0;

    for (const hotel of hotels) {
        try {
            // calculam distanta pana la cel mai apropiat aeroport
            const distanceKm = await findNearestAirportDistance(
                hotel,
                airports,
            );

            // update la metadatele hotelului
            await hotel.update({
                FloorsNumber: parseInt(String(DEFAULT_FLOORS)),
                RoomsNumber: parseInt(String(DEFAULT_ROOMS)),
                HotelStars: hotel.SabrePropertyRating
                    ? parseFloat(String(hotel.SabrePropertyRating))
                    : null,
                DistanceToAirport: distanceKm,
            });

            // scor pentru metadate
            const stars = hotel.SabrePropertyRating
                ? normalizeStars(Number(hotel.SabrePropertyRating))
                : 3;
            const distance =
                distanceKm !== null ? normalizeDistance(distanceKm) : 3;
            const rooms = Math.random() * 4 + 1;
            const floors = Math.random() * 4 + 1;

            const metadataScore =
                stars * WEIGHT_STARS +
                distance * WEIGHT_DISTANCE +
                rooms * WEIGHT_ROOMS +
                floors * WEIGHT_FLOORS;

            // introducem hotel rating in tabela
            await HotelRating.create({
                HotelID: hotel.GlobalPropertyID,
                MetadataScore: Math.round(metadataScore * 100) / 100,
                ReviewCount: 0,
                CalculatedAt: new Date().toISOString().split("T")[0],
                AmenitiesRate: null,
                CleanlinessRate: null,
                FoodBeverage: null,
                SleepQuality: null,
                InternetQuality: null,
                FinalScore: null,
            });

            updated++;
        } catch (err) {
            console.error(
                `Hotel ${hotel.GlobalPropertyID}: ${(err as Error).message}`,
            );
            skipped++;
        }
    }

    console.log(`${updated} hotels updated with metadata, ${skipped} skipped`);
}
