const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategoryById,
    getSearchCategory,
    createCategory,
    deleteCategory,
    updateCategory,
} = require('../controllers/categoryController');

//Post route
router.post('/create_category', createCategory);

//Update route
router.put('/update_category/:id', updateCategory);

//Delete route
router.delete('/delete_category/:id', deleteCategory);

//Get category
router.get('/get_category/:id', getCategoryById);

//Get all categories
router.get('/category', getAllCategories);

//Get Search category
router.get('/search_category', getSearchCategory);

module.exports = router;
