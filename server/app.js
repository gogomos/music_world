require('dotenv').config();
const express = require('express');
const app = express();

const connectDb = require('./config/database');
const PORT = require('./config/env').PORT;

const indexRoutes = require('./routes/index.routes');

// ------ Middlewares ------
connectDb();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/v1', indexRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
