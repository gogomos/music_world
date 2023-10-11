require('dotenv').config();

const express = require ('express');
// const expressLayout = require ('express-ejs-layouts');
// const cookieParser = require('cookie-parser');
// const MongoStore = require('connect-mongo');
// const methodOverride = require('method-override');
// const connectDB = require('./server/config/db');
// const session = require('express-session');
// const {isActivateRoute} = require('./server/helpers/routeHelpers');



const app = express();
const PORT = 5000 || process.env.PORT;







app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})