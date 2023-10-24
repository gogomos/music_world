const bcrypt = require('bcrypt');

const saltRounds = require('../config/env').SALT;
const Customer = require('../models/customer');
const authService = require('../services/authServices');

exports.getAllCustomersList = async (req, res) => {
    const page = req.query.page || 0;
    const sort = req.query.sort || 'DESC';
    const customerPerPage = 2;

    try {
        const customers = await Customer.find()
            .skip(page * customerPerPage)
            .sort({ first_name: sort })
            .limit(customerPerPage);

        if (!customers) {
            return res.status(404).json({ message: 'customers not found' });
        }

        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: 'customer not found' });
        }

        return res.status(200).json(customer);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.deleteCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) res.status(404).json({ message: 'Customer not found' });
        return res
            .status(200)
            .json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCustomers = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(parseInt(saltRounds));
        const hashedPassword = await bcrypt.hash(password, salt);

        const id = { _id: req.params.id };
        const updatedFields = {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
        };

        if (email) {
            const exists = await Customer.findOne({ email });
            if (exists) {
                return res
                    .status(400)
                    .json({ message: 'email is already existed' });
            }
        }
        if (password) {
            updatedFields.password = hashedPassword;
        }

        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            updatedFields,
            { new: true }
        );
        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchForCustomer = async (req, res) => {
    const query = req.query.first_name || '';
    const page = req.query.page || 0;
    const sort = req.query.sort || 'DESC';
    const customersPerPage = 2;

    const searchCriteria = {
        first_name: { $regex: query, $options: 'i' },
    };

    try {
        const customers = await Customer.find(searchCriteria)
            .sort({ first_name: sort })
            .skip(page * customersPerPage)
            .limit(customersPerPage);

        if (!customers || customers.length === 0) {
            return res.status(404).json({
                message: 'No customers found matching the search criteria',
            });
        }
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProfile = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) res.status(404).json({ message: 'Customer not found' });
        return res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.registerCustomer = (req, res) => {
    authService.authRegister(req, res, Customer);
};

exports.loginCustomer = (req, res, next) => {
    authService.authLogin(req, res, next, 'local-customer');
};
















































// const bcrypt = require('bcrypt');
// const { validationResult } = require('express-validator');

// const Customer = require('../models/customer');
// const saltRounds = require('../config/env').SALT;
// const JwtSecretKey = require('../config/env').JwtSecretKey;
// const jwtHelper = require('../helpers/genToken');

// exports.getCustomerById = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const customer = await Customer.findById(id);

//         if (!customer) {
//             return res.status(404).json({ message: 'customers not found' });
//         }

//         res.status(200).json(customer);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// exports.getAllCustomersList = async (req, res) => {
//     const page = parseInt(req.query.page) || 0;
//     const sort = req.query.sort || 'DESC';
//     const customersPerPage = 10;

//     try {
//         const customers = await Customer.find()
//             .sort({ customername: sort })
//             .skip(page * customersPerPage)
//             .limit(customersPerPage);

//         if (!customers) {
//             return res.status(404).json({ message: 'customers not found' });
//         }

//         res.status(200).json(customers);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// exports.searchForCustomer = async (req, res) => {
//     const { query } = req.query || '';
//     const page = req.query.page || 0;
//     const sort = req.query.sort || 'DESC';
//     const customersPerPage = 10;

//     const searchCriteria = {
//         $or: [
//             { customername: { $regex: query, $options: 'i' } },
//             { email: { $regex: query, $options: 'i' } },
//         ],
//     };

//     try {
//         const customers = await Customer.find(searchCriteria)
//             .sort({ customername: sort })
//             .skip(page * customersPerPage)
//             .limit(customersPerPage);

//         if (!customers || customers.length === 0) {
//             return res.status(404).json({
//                 message: 'No customers found matching the search criteria',
//             });
//         }

//         res.status(200).json(customers);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// exports.registerCustomer = async (req, res) => {
//     const { firstName, lastName, customerName, email, password, role } = req.body;

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//         const salt = await bcrypt.genSalt(parseInt(saltRounds));
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const newCustomer = await Customer({
//             first_name: firstName,
//             last_name: lastName,
//             customername: customerName,
//             email,
//             password: hashedPassword,
//             role,
//             creation_date: Date.now(),
//         });

//         await newCustomer.save();

//         res.status(201).json({
//             message: 'Customer registered successfully',
//             customer: newCustomer,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// exports.loginCustomer = async (req, res) => {
//     const { email, password } = req.body;

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//         const customer = await Customer.findOne({ email });

//         if (!customer) {
//             return res.status(404).json({ message: 'Customer not found' });
//         }

//         const isPasswordValid = await bcrypt.compare(password, customer.password);

//         if (!isPasswordValid)
//             return res
//                 .status(401)
//                 .json({ message: 'Incorrect email or password' });

//         const jwt = jwtHelper.genToken(customer, JwtSecretKey);
//         const { token, expires } = jwt;

//         res.status(200).json({ customer, token, expiresIn: expires });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// exports.updateCustomer = async (req, res) => {
//     const { id } = req.params;
//     const { firstName, lastName, customerName, email, password, role } = req.body;

//     try {
//         const updatedFields = {
//             first_name: firstName,
//             last_name: lastName,
//             customername: customerName,
//             email,
//             role,
//             last_update: Date.now(),
//         };

//         if (password) {
//             const hashedPassword = await bcrypt.hash(password, salt);
//             updatedFields.password = hashedPassword;
//         }

//         const customer = await Customer.findByIdAndUpdate(id, updatedFields, {
//             new: true,
//         });

//         if (!customer) {
//             return res.status(404).json({ message: 'customers not found' });
//         }
//         res.status(201).json({ message: 'Customer updated successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// exports.deleteCustomer = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const customer = await Customer.findByIdAndDelete(id);

//         if (!customer) {
//             return res.status(404).json({ message: 'customer not found' });
//         }

//         res.status(200).json({ message: 'Customer deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };




