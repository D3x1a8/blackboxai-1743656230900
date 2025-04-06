export default async function handler(req, res) {
  const { slug } = req.query;
  try {
    const apiResponse = await fetch(`http://localhost:3001/categories/${slug}`);
    if (!apiResponse.ok) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const data = await apiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
}