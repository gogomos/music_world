require('dotenv').config();

const express = require ('express');
const authRoutes = require('./routes/userRoutes');
// const expressLayout = require ('express-ejs-layouts');
// const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
// const methodOverride = require('method-override');
const connectDB = require('./config/database');
// const session = require('express-session');
// const {isActivateRoute} = require('./server/helpers/routeHelpers');



const app = express();
const PORT = 5000 || process.env.PORT;

//connect db
connectDB();
app.use('/', authRoutes);

// app.use('/', require('./routes/api'));
// app.use('/', require('./routes/userRoutes'));


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})