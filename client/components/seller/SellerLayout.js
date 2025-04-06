import React from 'react';

const SellerLayout = ({ children }) => {
    return (
        <div className="seller-layout">
            <header>
                <h1>Seller Dashboard</h1>
            </header>
            <main>{children}</main>
        </div>
    );
};

export default SellerLayout;
