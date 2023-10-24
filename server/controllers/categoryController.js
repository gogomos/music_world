const Category = require('../models/Category.js');

// Create Category
exports.createCategory = async (req, res) => {
    try {
        const { name, active } = req.body;

        if (!name) {
            return res
                .status(401)
                .send({ message: 'Category Name is Required' });
        }

        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: 'Category already exists',
            });
        }

        const category = await Category({ name, active }).save();

        res.status(201).send({
            success: true,
            message: 'New category created',
            category,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error creating category',
        });
    }
};

// Update Category
exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const id = req.params.id;
        const category = await Category.findByIdAndUpdate(id, { name });

        if (!category) {
            return res.status(404).send({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Category updated successfully',
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error updating category',
        });
    }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error deleting category',
            error,
        });
    }
};

//Get category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findById(id);
        res.status(200).send({
            success: true,
            message: 'Category found successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error finding category',
            error,
        });
    }
};

//Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const categories = await Category.find({})
            .limit(limit)
            .skip(skip)
            .select('_id');

        if (categories.length === 0) {
            return res.status(200).send([]);
        }
        res.status(200).send({
            data: categories,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error listing all the categories',
            error,
        });
    }
};

//Get search Category
exports.getSearchCategory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const searchTerm = req.query.search || '';

        const searchRegex = new RegExp(searchTerm, 'i');

        const query = searchTerm ? { name: { $regex: searchRegex } } : {};

        const categories = await Category.find({}).limit(limit).skip(skip);

        if (categories.length === 0) {
            return res.status(200).send([]);
        }
        res.status(200).send({
            success: true,
            message: 'Categories listed successfully',
            data: categories,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error listing all the categories',
            error,
        });
    }
};
