export default async function handler(req, res) {
  const { category } = req.query;
  try {
    const apiResponse = await fetch(`http://localhost:3001/products/category/${category}`);
    if (!apiResponse.ok) {
      return res.status(404).json({ error: 'No products found for this category' });
    }
    const data = await apiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category products' });
  }
}