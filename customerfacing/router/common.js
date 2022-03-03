const { response } = require("express");
const express = require ("express");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const db = require("../config/mongodb");

const router = express.Router();

const newsCollection = () =>{
    return db.getCollection("news");
}

router.get("/home/",(req, res)=>{
    res.render("home");
});

// router.get("/sports/", (req, res)=>{
//     let sportsCollection = db.getCollection("sports");
//     sportsCollection.find({}).toArray()
//     .then((data)=>{
//         res.render("sports", {content: data})
//     })
// })

router.get("/aboutus/", (req, res)=>{
    //send aboutus page
    res.render("aboutus");
})

router.get("/contactus/", (req, res)=>{
    //send contact us page
    res.render("contactus");
})

router.post("/contactus/query/", (req, res)=>{
    try{
        db.getCollection("query").insertOne({"email" : req.body.email, "message" : req.body.message});
    } catch (e) {
        console.log(e);
        res.render("contactusresponse", {content: {title: "Oops!" ,message : "Failed to send the message, please try again"}});
    }
    
    res.render("contactusresponse", {content: {title: "Message sent successfully", message : "We will get back to you as soon as we can"}});
})

router.get("/latestnews/", (req, res)=>{
    //get latest news last 3
    newsCollection().find({}).sort({time:-1}).limit(3).toArray()
        .then((data)=>{
            res.send(data);
        })
})

router.get("/sports/", (req, res)=>{
    var sportsapikey = "0b50179f3bea4bb8a5986e398d773c22";
    var country = "in"
    var category = "sport"
    let sportsurl = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${sportsapikey}`
    fetch(sportsurl).then(response=>response.json()).then(json=>{
        res.render("sports", {content: json.articles});
    })
})

module.exports = router;