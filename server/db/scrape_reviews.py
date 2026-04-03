import csv
import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("TRIPADVISOR_API_KEY")
BASE_URL = "https://api.content.tripadvisor.com/api/v1"
INPUT_CSV = "data_clean.csv"
OUTPUT_CSV = "reviews.csv"
CHECKPOINT_FILE = "checkpoint.txt"
MAX_CALLS = 4800

def parse_csv(filepath: str) -> list:
    rows = []
    with open(filepath, encoding="utf-8-sig") as f:
        reader = csv.reader(f, delimiter=";")
        headers = [h.strip() for h in next(reader)]
        for row in reader:
            values = [v.strip() for v in row]
            record = {}
            for i, h in enumerate(headers):
                record[h] = values[i] if i < len(values) else ""
            rows.append(record)
    return rows

hotels = parse_csv(INPUT_CSV)
print(f"Total hotels loaded: {len(hotels)}")
if hotels:
    print(f"First hotel keys: {list(hotels[0].keys())[:5]}")
    print(f"First hotel: {hotels[0]}")

calls_used = 0

def search_location(hotel_name: str, city: str) -> str | None:
    global calls_used
    url = f"{BASE_URL}/location/search"
    params = {
        "key": API_KEY,
        "searchQuery": f"{hotel_name} {city}",
        "category": "hotels",
        "language": "en",
    }
    try:
        res = requests.get(url, params=params, timeout=10)
        calls_used += 1
        data = res.json()
        locations = data.get("data", [])
        if locations:
            return locations[0]["location_id"]
    except Exception as e:
        print(f"Search error for {hotel_name}: {e}")
    return None

def get_reviews(location_id: str) -> list:
    global calls_used
    url = f"{BASE_URL}/location/{location_id}/reviews"
    params = {
        "key": API_KEY,
        "language": "en",
    }
    try:
        res = requests.get(url, params=params, timeout=10)
        calls_used += 1
        data = res.json()
        return data.get("data", [])
    except Exception as e:
        print(f"Reviews error for location {location_id}: {e}")
    return []

def load_checkpoint() -> set:
    try:
        with open(CHECKPOINT_FILE, "r") as f:
            return set(line.strip() for line in f if line.strip())
    except FileNotFoundError:
        return set()

def save_checkpoint(hotel_id: str):
    with open(CHECKPOINT_FILE, "a") as f:
        f.write(hotel_id + "\n")

def main():
    global calls_used

    processed = load_checkpoint()
    hotels = parse_csv(INPUT_CSV)

    with open(OUTPUT_CSV, "a", newline="", encoding="utf-8") as out:
        writer = csv.writer(out, delimiter=";")

        if not processed:
            writer.writerow([
                "GlobalPropertyID", "HotelName", "City",
                "ReviewID", "Rating", "Title", "Text",
                "PublishedDate", "TripAdvisorLocationID"
            ])

        for hotel in hotels:
            hotel_id = hotel.get("Global Property ID", "").strip()
            hotel_name = hotel.get("Global Property Name", "").strip()
            city = hotel.get("Property City Name", "").strip()

            if not hotel_id or not hotel_name or not city:
                continue

            if hotel_id in processed:
                continue

            if calls_used + 2 > MAX_CALLS:
                print(f"Approaching call limit ({calls_used}/{MAX_CALLS}). Stopping.")
                break

            print(f"[{calls_used}/{MAX_CALLS}] Searching: {hotel_name}, {city}")

            location_id = search_location(hotel_name, city)
            if not location_id:
                save_checkpoint(hotel_id)
                time.sleep(0.5)
                continue

            reviews = get_reviews(location_id)

            for review in reviews:
                writer.writerow([
                    hotel_id,
                    hotel_name,
                    city,
                    review.get("id", ""),
                    review.get("rating", ""),
                    review.get("title", ""),
                    review.get("text", ""),
                    review.get("published_date", ""),
                    location_id,
                ])

            out.flush()
            save_checkpoint(hotel_id)
            print(f"  → {len(reviews)} reviews saved")
            time.sleep(0.5)

    print(f"\nDone. Total calls used: {calls_used}")

if __name__ == "__main__":
    main()