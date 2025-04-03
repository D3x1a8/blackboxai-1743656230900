export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/related/${id}`);
    const data = await apiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch related products' });
  }
}