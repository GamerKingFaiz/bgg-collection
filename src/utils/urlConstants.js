/*******************************
These URLs are using a self-hosted cors-anywhere reverse proxy to add a CORS header to the BGG API
Source: https://github.com/Rob--W/cors-anywhere
*******************************/
export const THING_ITEMS_ENDPOINT = 'https://cryptic-brushlands-34819.herokuapp.com/https://boardgamegeek.com/xmlapi2/thing?stats=1&id=';
export const COLLECTION_ENDPOINT = 'https://cryptic-brushlands-34819.herokuapp.com/https://api.geekdo.com/xmlapi2/collection?own=1&stats=1&excludesubtype=boardgameexpansion&username=';