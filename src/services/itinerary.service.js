import groq from "../configs/groq.js";


export const generateItinerary = async (travelData) => {
    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `
You are an expert travel planner.

Generate a detailed travel itinerary based on the provided travel information.

Return ONLY valid JSON.

Format:

{
  "tripSummary": "",
  "days": [
    {
      "day": 1,
      "title": "",
      "activities": []
    }
  ]
}

Do not use markdown.
Do not provide explanations.
`
            },
            {
                role: "user",
                content: JSON.stringify(travelData)
            }
        ],
        temperature: 0.7
    });

    return completion.choices[0].message.content;
};