const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');




/** 
 * POST /
 * regester check login
 */


router.post('/register', async (req, res) => {
    try {
        const {firstName, lastName, userName, email, password, role} = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            const user = await User.create({firstName, lastName, userName, email, password: hashedPassword, role});
            res.status(201).json({message: "user created successfully",user});
        } catch (error){
            if(error.code === 11000)
                res.status(409).json({message : 'User already in use'});
            res.status(400).json({message: "the field xxx should be of type xxx"});
        }
    }
    catch (error){
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});



module.exports = router;