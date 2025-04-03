export default async function handler(req, res) {
  const { slug } = req.query;
  try {
    const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/slug/${slug}`);
    const data = await apiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
}