# Glossary

- **Trip**: a planned journey with a name, destinations and dates. Today a trip stores one destination with a start date and an end date. From Slice 2.5 a trip holds one or more destinations in order ([0008](decisions/0008-trips-with-several-destinations.md)).
- **Destination**: a city or area in a trip. From Slice 2.5 each destination has its own start and end date (for example Bangkok, 8–11 Jan).
- **Day**: one calendar day of a trip. Day 1 is the start date. Start and end dates both count. From Slice 2.5, a day belongs to the destination whose dates include it.
- **Pin** (ปักหมุด): a place saved to a trip, with a note, a category, an estimated cost and opening hours. From Slice 3, a pin on a day can be ticked off as visited.
- **Bucket list**: all the pins of a trip: the places the traveller wants to see.
- **Wishlist**: pins not yet scheduled on a day.
- **Itinerary**: a trip's days, each holding ordered pins with optional time slots.
- **Date format**: stored as ISO `YYYY-MM-DD`, shown and typed as dd/mm/yyyy (for example 01/12/2026).
- **Expense**: money actually spent on the trip (Slice 6), in whole THB, with a category and a day, and optionally a pin ([0009](decisions/0009-track-real-spending-in-mvp.md)).
- **Traveller**: a person on a trip, added by name (no account).
- **Payer**: the traveller who paid for a cost item.
- **Share**: the part of a cost item a traveller is responsible for (equal or custom split).
- **Balance**: what a traveller paid minus their shares. Positive means they get money back, negative means they owe.
- **Settle up**: the list of payments between travellers that brings every balance to zero.
- **Category**: what kind of place a pin is: Food, Temple, Nature, Shopping, Nightlife or Stay.
- **Place**: a search result (name, area, coordinates) before it is pinned.
