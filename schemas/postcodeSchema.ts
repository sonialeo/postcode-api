export const postcodeSchema = {
  type: "object",
  required: ["country", "country abbreviation", "places"],
  properties: {
    country: { type: "string" },
    "country abbreviation": { type: "string" },
    places: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["place name", "longitude", "latitude", "state"],
        properties: {
          "place name": { type: "string" },
          longitude: { type: "string" },
          latitude: { type: "string" },
          state: { type: "string" }
        }
      }
    }
  }
};