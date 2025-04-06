const express = require('express');
const cors = require('cors'); // Import CORS middleware
const app = express();

// Use CORS middleware
app.use(cors({
    origin: 'http://localhost:3000' // Allow requests from the client application
}));

// Other existing code...
app.use(express.json());

// Define routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes')); // Ensure product routes are included
app.use('/api/categories', require('./routes/categoryRoutes')); // Ensure category routes are included

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
