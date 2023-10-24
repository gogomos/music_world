const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const User = require('../models/User');
const {
    getAllUsersList,
    getUserById,
    searchForUser,
    loginUser,
    registerUser,
    updateUser,
    deleteUser,
} = require('../controllers/userController');

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
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    throw new Error('Email is already in use');
                }
            }),
        check('role')
            .notEmpty()
            .withMessage('Role is required')
            .isIn(['manager', 'admin']),
        check('userName')
            .notEmpty()
            .withMessage('Username is required')
            .custom(async (username) => {
                // Check if the username is already registered
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    throw new Error('Username is already in use');
                }
            }),
        check('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long'),
    ],
    registerUser
);

router.post(
    '/login',
    [
        check('email').notEmpty().isEmail().withMessage('Email is required'),
        check('password').notEmpty().withMessage('Password is required'),
    ],
    loginUser
);

router.get('/', getAllUsersList);
router.get('/search', searchForUser);
router.get('/v1/user/:id', getUserById);

router.put('/v1/user/:id', updateUser);

router.delete('/v1/user/:id', deleteUser);

module.exports = router;























































// const express = require('express');
// const router = express.Router();
// const { check, validationResult } = require('express-validator');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');



// const authMiddleware = (req, res, next) => {
//     const token = req.cookies.token;
//     if(!token) {
//         return res.status(401).json( {message: 'Unauthorized'});
//     }

//     try {
//         const decoded = jwt.verify(token, jwtSecret);
//         req.userId = decoded.userId;
//         next();
//     } catch (error) {
//         res.status(401).json({message: 'Unauthorized'});
//     }
// }
// router.post('/register', [
//     check('user_name', 'Username is required').not().isEmpty(),
//     check('email', 'Please include a valid email').isEmail(),
//     check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
//     check('role', 'Role is required').not().isEmpty(),
// ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const {first_name, last_name, user_name, email, password, role } = req.body;

//     try {
//         // Check if user with given email already exists
//         let user = await User.findOne({ email });

//         if (user) {
//             return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
//         }

//         user = new User({
//             last_name,
//             first_name,
//             user_name,
//             email,
//             password,
//             role,
//         });

//         // Hash password
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(password, salt);

//         // Save user to database
//         await user.save();

//         // Create and return JWT token
//         const payload = {
//             user: {
//                 id: user.id,
//                 role: user.role,
//             }
//         };

//         jwt.sign(payload, 'your-secret-key', { expiresIn: 3600 }, (err, token) => {
//             if (err) throw err;
//             res.json({ token });
//         });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// });

// //login

// router.post('/login', [
//     check('email', 'Please include a valid email').isEmail(),
//     check('password', 'Password is required').exists(),
// ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = req.body;

//     try {
//         // Check if user exists
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
//         }

//         // Check password
//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
//         }

//         // Create and return JWT token
//         const payload = {
//             user: {
//                 id: user.id,
//                 role: user.role,
//             },
//         };

//         jwt.sign(payload, 'your-secret-key', { expiresIn: 3600 }, (err, token) => {
//             if (err) throw err;
//             res.json({ token });
//         });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// });

// router.get('/', authMiddleware, async (req, res) => {
//     try {
//         // Extract query parameters
//         const page = parseInt(req.query.page) || 1;
//         const sort = req.query.sort || 'ASC'; // Default to ascending order

//         // Determine the number of documents to skip based on the page
//         const perPage = 10; // Adjust as needed
//         const skip = (page - 1) * perPage;

//         // Sort order
//         const sortOptions = {};
//         sortOptions['creation_date'] = sort === 'DESC' ? -1 : 1;

//         // Fetch users from the database with pagination and sorting
//         const users = await User.find()
//             .skip(skip)
//             .limit(perPage)
//             .sort(sortOptions);

//         res.json(users);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // Get user by ID
// router.get('/v1/users/:id', authMiddleware, async (req, res) => {
//     try {
//         const userId = req.params.id;

//         // Check if the provided ID is a valid MongoDB ObjectId
//         if (!mongoose.Types.ObjectId.isValid(userId)) {
//             return res.status(400).json({ msg: 'Invalid user ID' });
//         }

//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ msg: 'User not found' });
//         }

//         res.json(user);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // Search for a user
// router.get('/search', authMiddleware, async (req, res) => {
//     // Search logic
// });

// // Update user
// router.put('/:id', authMiddleware, [
//     // Validation checks
// ], async (req, res) => {
//     // Update user logic
// });

// // Delete user
// router.delete('/:id', authMiddleware, async (req, res) => {
//     // Delete user logic
// });

// module.exports = router;