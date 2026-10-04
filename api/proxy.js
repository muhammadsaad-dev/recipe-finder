export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Server configuration error: SPOONACULAR_API_KEY environment variable is not set.',
    });
  }

  const { endpoint = 'recipes/complexSearch', ...queryParams } = req.query;

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else {
        searchParams.append(key, value);
      }
    }
  }
  searchParams.set('apiKey', apiKey);

  const targetUrl = `https://api.spoonacular.com/${endpoint}?${searchParams.toString()}`;

  try {
    const response = await fetch(targetUrl);
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error proxying request to Spoonacular:', error);
    return res.status(500).json({ error: 'Failed to fetch data from Spoonacular API.' });
  }
}
