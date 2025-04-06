export default async function handler(req, res) {
  try {
    const apiResponse = await fetch(`http://localhost:3001/products`);
    const data = await apiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}