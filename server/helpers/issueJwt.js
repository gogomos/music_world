const jwt = require('jsonwebtoken');
const issueJwt = (user, secretKey) => {
const userId = user._id;
const expiresIn = '1d';

    const payload = { userId };
 

    const token = jwt.sign(payload, secretKey, { expiresIn });

    return {
        token: 'Bearer ' + token,
        expires: expiresIn,
    };
};

module.exports.issueJwt = issueJwt;