// fetchApi.js
const API_KEY = "PQv8xNuzdGx4pl9xXYcSkXByW5rYddhFc6zCHuVM";
const BASE_URL = "https://quizapi.io/api/v1/questions";

export async function fetchFromApi(category = "Linux", difficulty = "easy", limit = 5, tags = "") {
  try {
    const url = new URL(BASE_URL);
    url.searchParams.append("apiKey", API_KEY);
    url.searchParams.append("category", category);
    url.searchParams.append("difficulty", difficulty);
    url.searchParams.append("limit", limit);
    if (tags) url.searchParams.append("tags", tags);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching quiz from API:", error);
    return [];
  }
}
