const express = require('express');
const router = express.Router();

// Routes
const categoryRoutes = require('./categoryRoutes.js');
const subcategoryRoutes = require('./subcategoryRoutes.js');

router.use('/subcategories', subcategoryRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;