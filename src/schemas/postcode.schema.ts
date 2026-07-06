export const postcodeSchema = {
  type: 'object',
  required: ['country', 'post code', 'places'],
  additionalProperties: false,

  properties: {
    country: { type: 'string' },
    'country abbreviation': { type: 'string' },
    'post code': { type: 'string' },

    places: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: [
          'place name',
          'longitude',
          'latitude',
          'state',
          'state abbreviation'
        ],
        additionalProperties: false,

        properties: {
          'place name': { type: 'string' },
          longitude: { type: 'string' },
          latitude: { type: 'string' },
          state: { type: 'string' },
          'state abbreviation': { type: 'string' }
        }
      }
    }
  }
};