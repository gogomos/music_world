const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const User = require('../models/User');
const saltRounds = require('../config/env').SALT;
const JwtSecretKey = require('../config/env').JwtSecretKey;
const jwtHelper = require('../helpers/issueJwt');

exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'users not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUsersList = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const sort = req.query.sort || 'DESC';
    const usersPerPage = 10;

    try {
        const users = await User.find()
            .sort({ username: sort })
            .skip(page * usersPerPage)
            .limit(usersPerPage);

        if (!users) {
            return res.status(404).json({ message: 'users not found' });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchForUser = async (req, res) => {
    const { query } = req.query || '';
    const page = req.query.page || 0;
    const sort = req.query.sort || 'DESC';
    const usersPerPage = 10;

    const searchCriteria = {
        $or: [
            { username: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
        ],
    };

    try {
        const users = await User.find(searchCriteria)
            .sort({ username: sort })
            .skip(page * usersPerPage)
            .limit(usersPerPage);

        if (!users || users.length === 0) {
            return res.status(404).json({
                message: 'No users found matching the search criteria',
            });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.registerUser = async (req, res) => {
    const { firstName, lastName, userName, email, password, role } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const salt = await bcrypt.genSalt(parseInt(saltRounds));
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User({
            first_name: firstName,
            last_name: lastName,
            username: userName,
            email,
            password: hashedPassword,
            role,
            creation_date: Date.now(),
        });

        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid)
            return res
                .status(401)
                .json({ message: 'Incorrect email or password' });

        const jwt = jwtHelper.issueJwt(user, JwtSecretKey);
        const { token, expires } = jwt;

        res.status(200).json({ user, token, expiresIn: expires });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, userName, email, password, role } = req.body;

    try {
        const updatedFields = {
            first_name: firstName,
            last_name: lastName,
            username: userName,
            email,
            role,
            last_update: Date.now(),
        };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, salt);
            updatedFields.password = hashedPassword;
        }

        const user = await User.findByIdAndUpdate(id, updatedFields, {
            new: true,
        });

        if (!user) {
            return res.status(404).json({ message: 'users not found' });
        }
        res.status(201).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};