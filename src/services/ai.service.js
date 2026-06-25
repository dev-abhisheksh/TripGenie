import groq from "../configs/groq.js";

export const extractTravelData = async (text) => {
    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `
You are an expert travel document parser.

Extract any travel-related information you can find from the text.

Infer airport codes and cities when obvious.

Example:
JFK -> New York
LHR -> London

Return ONLY valid JSON.

{
  "passengerName": null,
  "flightNumber": null,
  "departureAirport": null,
  "arrivalAirport": null,
  "departureCity": null,
  "arrivalCity": null,
  "departureDate": null,
  "returnDate": null,
  "hotelName": null,
  "checkInDate": null,
  "checkOutDate": null,
  "location": null
}

Identify the primary destination city or region of the travel (e.g. "Rio de Janeiro") and populate it in the "location" field.
Do not include explanations.
Do not use markdown.
`
            },
            {
                role: "user",
                content: text
            }
        ],
        temperature: 0
    });

    return completion.choices[0].message.content;
};