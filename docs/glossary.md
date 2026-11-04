# Glossary

- **Trip**: a planned journey made of one or more destinations, in order. It starts on the first destination's start date and ends on the last destination's end date ([0004](decisions/0004-trips-with-several-destinations.md)).
- **Destination**: a city or area in a trip, with its own start date and end date (for example Bangkok, 8–11 Jan).
- **Day**: one calendar day of a trip. Day 1 is the trip's start date. Start and end dates both count. A day belongs to the destination whose dates include it.
- **Pin** (ปักหมุด): a place saved to a trip, with a note, a category, a planned cost and opening hours. A pin can be ticked off as visited.
- **Bucket list**: all the pins of a trip: the places the traveller wants to see.
- **Wishlist**: pins not yet scheduled on a day.
- **Itinerary**: a trip's days, each holding ordered pins with optional time slots.
- **Planned cost**: what a traveller expects a pin to cost, in integer THB. The planned budget is the sum of planned costs.
- **Expense**: money actually spent on the trip, in integer THB, with a category and a day. It may link to a pin ([0005](decisions/0005-track-real-spending-in-mvp.md)).
- **Traveller**: a person on a trip, stored as a name only, used to split expenses.
