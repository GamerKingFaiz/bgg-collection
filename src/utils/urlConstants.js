/*******************************
These URLs are using a self-hosted cors-anywhere reverse proxy to add a CORS header to the BGG API
Source: https://github.com/Rob--W/cors-anywhere
*******************************/
const CORS_URL = 'https://web-production-de84.up.railway.app'
export const THING_ITEMS_ENDPOINT = `${CORS_URL}/https://boardgamegeek.com/xmlapi2/thing?stats=1&id=`;
export const COLLECTION_ENDPOINT = `${CORS_URL}/https://api.geekdo.com/xmlapi2/collection?own=1&stats=1&excludesubtype=boardgameexpansion&username=`;
