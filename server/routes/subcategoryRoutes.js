const express = require('express');
const router = express.Router();
const createSubCategoryController = require('../controllers/subcategoryController');
const deleteSubCategoryController = require('../controllers/subcategoryController');
const getSubCategoryController = require('../controllers/subcategoryController');
const getAllSubCategoryController = require('../controllers/subcategoryController');
const getSearchSubCategoryController = require('../controllers/subcategoryController');
const updateSubCategoryController = require('../controllers/subcategoryController');



router.post('/create-subcategory', createSubCategoryController);
router.delete('/delete-subcategory', deleteSubCategoryController);
router.get('/get-subcategory', getSubCategoryController);
router.get('/get-allsubcategory', getAllSubCategoryController)
router.get('/get-SearchSubCategory', getSearchSubCategoryController)
router.put('/put-subcategory', updateSubCategoryController)

module.exports = router;
