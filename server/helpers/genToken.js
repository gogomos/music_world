const jwt = require('jsonwebtoken');
const genToken = (user, secretKey) => {
const userId = user._id;
const expiresIn = '1d';

    const payload = { userId };
 

    const token = jwt.sign(payload, secretKey, { expiresIn });

    return {
        token: 'Token' + token,
        expires: expiresIn,
    };
};

module.exports.genToken = genToken;