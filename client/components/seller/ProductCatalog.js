import React from 'react';

const ProductCatalog = ({ products, loading, onProductSelect }) => {
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="product-catalog">
            <h2>Product Catalog</h2>
            <ul>
                {products.map(product => (
                    <li key={product.id} onClick={() => onProductSelect(product)}>
                        {product.name} - ${product.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductCatalog;
