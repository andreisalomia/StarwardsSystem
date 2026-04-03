# Hotel Rating System

## FinalScore

FinalScore este ReviewScore x 0.7 + MetadataScore x 0.3, asta daca avem minim 3 review-uri. Altfel, FinalScore = MetadataScore.

## MetadataScore

MetadataScore este media weighted cu urmatoarele ponderi: 0.4 pentru `stars`, 0.3 pentru `distance`, 0.15 pentru `rooms`, 0.15 pentru `floors`.

- `stars` = SabrePropertyRating, daca nu exista atunci o punem 3
- `distance` = 5 - (min(km, 50) / 50) × 4  = adica 5 la 0km, 1 la 50+ km
- `rooms`, `floors` = random 1–5 (TODO: date reale)

## ReviewScore

Media scorurilor non-null returnate de api pentru:
`AmenitiesRate`, `CleanlinessRate`, `FoodBeverage`, `SleepQuality`, `InternetQuality`
