const express = require ("express");
const sessionAuth = require("../config/sessionAuth");
const db = require("../config/mongodb");
const { route } = require("express/lib/application");

const router = express.Router();

router.get("/home/",(req, res)=>{
    res.render("home");
});

router.get("/sports/", (req, res)=>{
    res.render("sports");
})

router.get("/aboutus/", (req, res)=>{
    //send aboutus page
    res.render("aboutus");
})

router.get("/contactus/", (req, res)=>{
    //send contact us page
    res.render("contactus");
})

router.post("/contactus/query/", (req, res)=>{
    //post the message in DB
})

router.get("/latestnews/", (req, res)=>{
    //get latest news last 3
})

router.get("/weather/",(req, res)=>{
    //weather api written inside weatherreport.ejs

    // res.render("weatherreport", {content: weatherdetails});
    res.render("weatherreport");
})

module.exports = router;