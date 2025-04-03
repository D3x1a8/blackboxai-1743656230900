const products = [];

module.exports = {
  query: (text, params) => {
    if (text.startsWith('INSERT INTO products')) {
      const product = {
        id: Math.floor(Math.random() * 1000),
        name: params[0],
        description: params[1],
        price: params[2],
        category_id: params[3],
        supplier_id: params[4],
        cost_price: params[5],
        margin_percent: params[6]
      };
      products.push(product);
      return Promise.resolve({ rows: [product] });
    }
    return Promise.resolve({ rows: [] });
  }
};