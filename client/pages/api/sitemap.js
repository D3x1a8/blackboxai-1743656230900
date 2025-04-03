import { getProducts, getCategories } from '../../lib/api';

export default async function handler(req, res) {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  const productUrls = products.map(product => `
    <url>
      <loc>https://yaalgo.com/products/${product.slug}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `);

  const categoryUrls = categories.map(category => `
    <url>
      <loc>https://yaalgo.com/products/category/${category.slug}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
  `);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://yaalgo.com</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>https://yaalgo.com/products</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
      </url>
      ${productUrls.join('')}
      ${categoryUrls.join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
}