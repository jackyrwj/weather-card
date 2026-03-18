module.exports = async function handler(req, res) {
  const { city } = req.query;

  if (!city || typeof city !== 'string' || city.trim().length < 2) {
    return res.status(400).json({ error: 'A valid city name (at least 2 characters) is required' });
  }

  const sanitizedCity = city.trim().slice(0, 100);

  try {
    const url = `https://wttr.in/${encodeURIComponent(sanitizedCity)}?format=j1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'weather-card/1.0',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'City not found or weather service unavailable' });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Weather fetch error:', error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};
