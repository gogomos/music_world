const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const Customer = require('../models/customer');
const {
    getAllCustomersList,
    getCustomerById,
    searchForCustomer,
    loginCustomer,
    registerCustomer,
    updateCustomer,
    deleteCustomer,
} = require('../controllers/customerController');

router.post(
    '/',
    [
        check('firstName').notEmpty().withMessage('First name is required'),
        check('lastName').notEmpty().withMessage('Last name is required'),
        check('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Email is not valid')
            .custom(async (email) => {
                // Check if the email is already registered
                const existingCustomer = await Customer.findOne({ email });
                if (existingCustomer) {
                    throw new Error('Email is already in use');
                }
            }),
        check('role')
            .notEmpty()
            .withMessage('Role is required')
            .isIn(['manager', 'admin']),
        check('userName')
            .notEmpty()
            .withMessage('Customername is required')
            .custom(async (username) => {
                // Check if the username is already registered
                const existingCustomer = await Customer.findOne({ username });
                if (existingCustomer) {
                    throw new Error('Customername is already in use');
                }
            }),
        check('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long'),
    ],
    registerCustomer
);

router.post(
    '/login',
    [
        check('email').notEmpty().isEmail().withMessage('Email is required'),
        check('password').notEmpty().withMessage('Password is required'),
    ],
    loginCustomer
);

router.get('/', getAllCustomersList);
router.get('/search', searchForCustomer);
router.get('/:id', getCustomerById);

router.put('/:id', updateCustomer);

router.delete('/:id', deleteCustomer);
module.exports = router;