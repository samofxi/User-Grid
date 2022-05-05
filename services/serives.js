
const axios = require('axios');
const { param } = require('express/lib/request');
const bodyParser = require('body-parser');
const {check, validationResult}= require('express-validator');
const urlencodeParser = bodyParser.urlencoded({extended:false});
const qrcode = require('qrcode');
const crypto = require("crypto");
const user = require('../models/user.model');
const rootuser = require('../models/rootuser');
const { findOne } = require('../models/user.model');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const PDFDocument = require('pdfkit');
const hbs = require('nodemailer-express-handlebars')


exports.homeRoutes =   (req, res)=>{
    res.render('index')
} 

exports.neuUser = async (req,res,next) =>{
            
        console.log(req.body);
        let id = crypto.randomBytes(6).toString("hex");
        let birthday =  `${req.body.birth_date_day}.${req.body.birth_date_month}.${req.body.birth_date_year} `
        console.log(birthday);
        try {
            const newuser= await user.create({
                id: id,
                Testart: req.body.Testart,
                date: req.body.date,
                Uhrzeit:req.body.Uhrzeit,
                Vorname:req.body.Vorname,
                Nachname:req.body.Nachname,
                birthday:birthday ,
                email:birthday ,
                Strasse:req.body.Strasse,
                Postleitzahl:req.body.Postleitzahl,
                Ort:req.body.Ort
            })
            .then(function(data) {qrcode.toDataURL(id,(err,src) =>{
                res.redirect(`http://localhost:5000/termin/${id}`)
             })});
             let code = await qrcode.toDataURL(id);

             let transporter = nodemailer.createTransport({
                host: "smtp.strato.de",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                  user: process.env.user, // generated ethereal user
                  pass: process.env.pass, // generated ethereal password
                },
              });
             
              // send mail with defined transport object
              let info = await transporter.sendMail({
                from: '"MCON Schnelltestzentrum" <info@salman-mohammad.com>', // sender address
                to: req.body.email, // list of receivers
                subject: "Ihre Terminbestätigung MCOV Schnelltest", // Subject line
                text: code, // plain text body
                html: `
                  <p>Sehr geehrter Frau/Herr ${req.body.Nachname},</p>
                  <p>anbei erhalten Sie Ihre pers&ouml;nliche Registrierungsnummer f&uuml;r den COVID-19 Schnelltest. Bitte beachten Sie, dass diese Registrierungsnummer nur einmal verwendet werden kann.</p>
                  <p>Enclosed you will receive your personal registration number for the COVID-19 rapid test. Please note that this registration number can only be used once.</p>
                  <p>Ihre ID / your ID:</p>
                  <p>${id} </p>
                  <p>Ihr best&auml;tigter Testtermin / Your confirmed test date:</p>
                  <p> ${req.body.date}, ${req.body.Uhrzeit} Uhr</p>
                  <p>Ort / Location: Teststation : Gewerbepark (Antigen-Schnelltest) - Am See - 93059 - Regensburg</p>
                  <p>Wir bitten darum, zum vereinbarten Termin p&uuml;nktlich an der Station zu erscheinen.</p>
                  <p>Um den Test durchzuf&uuml;hren ben&ouml;tigen wir ein amtliches Ausweisdokument und Ihre Krankenversicherungskarte. Bei Kindern ohne Ausweisdokument gen&uuml;gt die Krankenversicherungskarte.</p>
                  <p>We kindly ask you to arrive at the test station on time at the above-mentioned appointment. In order to do the test, we need to match your photo ID and health insurance card with the registration. For children, only the health insurance card is required.</p>
                  <p>Sie erhalten Ihr Antigen-Schnelltest Ergebnis per Email bereits nach ca.15 Min. Im positiven Fall werden Ihre Daten direkt an das f&uuml;r Sie zust&auml;ndige Gesundheitsamt weitergeleitet (Gesetzesvorgabe gem&auml;&szlig; IfSG &sect;6) und Sie m&uuml;ssen sich sofort in h&auml;usliche Quarant&auml;ne begeben. Ein PCR Test ist zus&auml;tzlich notwendig &ndash; bitte wenden Sie sich hierf&uuml;r an Ihren Hausarzt. Das Gesundheitsamt wird mit Ihnen Kontakt aufnehmen und das weitere Vorgehen besprechen.</p>`,
                attachments: [   {   // data uri as an attachment
                    filename: `${id}_QrCOde.png`,
                    path: code
                }]

              });
             
        } catch (error) {
            res.send(error)
        }
        

        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(442).jsonp(error.array());
        }
    
    };

exports.find = (req,res) => {

        if(req.params.id){
            const id = req.params.id;
            console.log(id);
            user.findOne({ id: id})
            .then(data => {
                if(!data){
                    res.status(404).send({message: "User was not fund"});
                } else{
                    qrcode.toDataURL(id,(err,src) =>{
                        res.render('view', {qr_code: src, id: id, userdata: data}); 
                     });
                }
            });
        } else{
        user.find()
        .then(user => {
            res.send(user);
        })
        .catch(err => {
            res.status(500).send({message: err.message ||"the current user is not fund!"});
        })};
    
    };

    exports.login =   (req, res)=>{
        res.render('login')
    } 

 exports.rootUser = async (req,res) =>{
        console.log(req.body);
        let id = crypto.randomBytes(6).toString("hex");
        try {
            const newuser= await rootuser.findOne({
                OTP: req.body.OTP,
                username: req.body.email,
                password:req.body.password
            })
           if(newuser){
               const token = jwt.sign(
                {
                    email: newuser.name,
                }
               , 'secret123')
                return res.json({status: 'okay' , user: token})
           }
        } catch (error) {
            res.send(error)
        }
        

        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(442).jsonp(error.array());
        }
    };
