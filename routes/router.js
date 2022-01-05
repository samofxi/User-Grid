const express = require('express');
const route = express.Router();
const services = require('../services/serives')
const bodyParser = require('body-parser');
const {check, validationResult}= require('express-validator');
const urlencodeParser = bodyParser.urlencoded({extended:false});
/**
 * @description Root Route
 * @method GET 
 */
route.get('/termin-buchen', services.homeRoutes);
route.post('/alletermine', services.find);
route.get('/termin/:id', services.find);
route.get('/login',urlencodeParser, services.login);
route.post('/login', urlencodeParser,[check('','wählen Sie bitte eine Uhrzeit!').exists()], services.rootUser);
route.post('/termin-buchen', urlencodeParser, 
[check('Uhrzeit','wählen Sie bitte eine Uhrzeit!').exists()],services.neuUser);

route.get('/termin-buchen', services.homeRoutes);

module.exports = route