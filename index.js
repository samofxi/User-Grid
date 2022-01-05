const express = require('express');
const cors = require('cors');
const connectDB = require('./database/connection');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');
const {check, validationResult}= require('express-validator');

const PORT = process.env.PORT || 5000;
connectDB();
const app = express();
app.set('view engine', 'ejs');
const urlencodeParser = bodyParser.urlencoded({extended:false});
app.use(cors());
app.use(express.json());
app.use('/css', express.static(path.resolve(__dirname, "views")));
app.use('/', require('./routes/router'));

app.listen(PORT, () => console.log('node Started on 5000'));

