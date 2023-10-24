module.exports = {
    MongoURI: process.env.MONGODB_URI,
    PORT: process.env.PORT,
    tokenSecretKey : process.env.ACCESS_TOKEN_SECRET,
    JwtSecretKey: process.env.JWT_SECRET_KEY,

    SALT: process.env.SALT,
    // AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    // AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
    // AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    // AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

};