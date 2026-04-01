import Anthropic from "@anthropic-ai/sdk";
import { Review, HotelRating, Hotel } from "../models";
import { Op } from "sequelize";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MIN_REVIEWS = 3;

// weights intre review score si metadata score
const WEIGHT_REVIEWS = 0.7;
const WEIGHT_METADATA = 0.3;

const REVIEW_CATEGORIES = ["AmenitiesRate", "CleanlinessRate", "FoodBeverage", "SleepQuality", "InternetQuality"];

async function analyzeReviews(reviews: Review[]): Promise<any> {
    let reviewsText = "";

    for (let i = 0; i < reviews.length; i++) {
        if (reviews[i].Text) {
            reviewsText += `Review ${i + 1}: ${reviews[i].Text}\n`;
        }
    }

    const prompt = `Analyze the following hotel reviews and return scores from 1 to 5 for each category.
If there is not enough information for a category, return null.
Respond ONLY with a valid JSON object, no markdown, no backticks, no extra text.

Categories:
- AmenitiesRate: pool, gym, spa, parking, facilities
- CleanlinessRate: cleanliness, hygiene, tidiness
- FoodBeverage: food, restaurant, breakfast, drinks
- SleepQuality: sleep, bed, noise, comfort, quiet
- InternetQuality: wifi, internet, connection

Reviews:
${reviewsText}

Respond with this exact format:
{
  "AmenitiesRate": number or null,
  "CleanlinessRate": number or null,
  "FoodBeverage": number or null,
  "SleepQuality": number or null,
  "InternetQuality": number or null
}`;

    const response = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 256,
        messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    // claude raspunde cu json in markdown
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
}

function computeReviewScore(scores: any): number | null {
    let sum = 0;
    let count = 0;

    for (const key of REVIEW_CATEGORIES) {
        const value = scores[key];
        if (value != null) {
            sum += value;
            count++;
        }
    }

    if (count === 0) return null;

    return Math.round((sum / count) * 100) / 100;
}

export async function getOrComputeRating(hotelId: number) {
    const existing = await HotelRating.findOne({
        where: { HotelID: hotelId, AmenitiesRate: { [Op.ne]: null } },
    });
    if (existing) return existing;

    const reviews = await Review.findAll({ where: { HotelID: hotelId } });

    const hotelRating = await HotelRating.findOne({
        where: { HotelID: hotelId },
    });
    const metadataScore = Number(hotelRating?.MetadataScore) || 3;

    let finalScore = metadataScore;
    let amenitiesRate = null;
    let cleanlinessRate = null;
    let foodBeverage = null;
    let sleepQuality = null;
    let internetQuality = null;

    if (reviews.length >= MIN_REVIEWS) {
        const scores = await analyzeReviews(reviews);

        amenitiesRate = scores.AmenitiesRate;
        cleanlinessRate = scores.CleanlinessRate;
        foodBeverage = scores.FoodBeverage;
        sleepQuality = scores.SleepQuality;
        internetQuality = scores.InternetQuality;

        const reviewScore = computeReviewScore(scores);

        if (reviewScore !== null) {
            finalScore = Math.round((reviewScore * WEIGHT_REVIEWS + metadataScore * WEIGHT_METADATA) * 100) / 100;
        }
    }

    if (hotelRating) {
        await hotelRating.update({
            AmenitiesRate: amenitiesRate,
            CleanlinessRate: cleanlinessRate,
            FoodBeverage: foodBeverage,
            SleepQuality: sleepQuality,
            InternetQuality: internetQuality,
            FinalScore: finalScore,
            ReviewCount: reviews.length,
            CalculatedAt: new Date().toISOString().split("T")[0],
        });
        return hotelRating;
    }

    return HotelRating.create({
        HotelID: hotelId,
        AmenitiesRate: amenitiesRate,
        CleanlinessRate: cleanlinessRate,
        FoodBeverage: foodBeverage,
        SleepQuality: sleepQuality,
        InternetQuality: internetQuality,
        MetadataScore: metadataScore,
        FinalScore: finalScore,
        ReviewCount: reviews.length,
        CalculatedAt: new Date().toISOString().split("T")[0],
    });
}
