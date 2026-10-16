const API_BASE_URL = 'https://api.betterbggcollection.com/';
// The backend orchestrates collection + thing stats and returns a single
// JSON document with the xml2js-shaped `games` array the table expects.
export const COLLECTION_ENDPOINT = `${API_BASE_URL}collection?username=`;
