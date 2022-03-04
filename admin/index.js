const express = require("express");
const bodyParser = require("body-parser");
const db = require("./config/mongodb");
const path = require("path");
const localStorage = require('node-localstorage').LocalStorage('./scratch');
// const localStorage = new LocalStorage('./scratch');

const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const server = express();

server.set("view engine", "ejs");
server.set("views",
    [path.join(__dirname, "./views/")]);

db.connect();


server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.listen(3100);
server.get("/", (req, res) => {
    let token = localStorage.getItem('authtoken')
    if (!token) {
        res.render('registerlogin', { msg: null, errmsg: null });
    } else {
        jwt.verify(token, "This is my secret key", (err, user) => {
            if (!user) {
                res.render('registerlogin', { msg: null, errmsg: null });
            }
            let email = user.email;
            var userDB = db.getCollection('users');
            userDB.findOne({ email }).then(
                (record) => {
                    if (record) {
                        //success
                        res.render('homepage', { alert: null });
                    }
                    else {
                        res.render('registerlogin', { msg: null, errmsg: null })
                    }
                }
            )

        })
    }
})

server.post("/register/", (req, res) => {
    let userName = req.body.name;
    let email = req.body.email;
    var userDB = db.getCollection('users');

    userDB.findOne({ email }).then(
        (record) => {
            if (record) {
                res.render('registerlogin', { msg: null, errmsg: 'Email already registered' });
            }
            else {
                userDB.insertOne({ name: req.body.name, email: req.body.email, password: req.body.password })
                    .then(() => {
                        res.render('registerlogin', { msg: null, errmsg: "Successful" })
                    },
                        err => { throw new Error(err); })
            }
        }
    )
});

server.post("/login/", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    let repo = db.getCollection('users');
    repo.findOne({ email }).then(
        (record) => {
            if (!record) {
                res.render('registerlogin', { msg: "Invalid Email", errmsg: null })
            } else if (record.password == password) {
                const token = jwt.sign({
                    _id: record._id,
                    email: record.email
                },
                    "This is my secret key",
                    {
                        expiresIn: '24h'
                    }
                );
                const response = {
                    email: record.email,
                    id: record._id,
                    token: token
                }
                localStorage.setItem('authtoken', token)
                res.render('homepage', { alert: null });;
            } else {
                res.render('registerlogin', { msg: "Wrong_Password", errmsg: null })
            }
        })
});

server.get("/logout/", (req, res) => {
    let token = localStorage.getItem('authtoken')
    if (!token) {
        res.render('registerlogin', { msg: null, errmsg: null });
    } else {
        localStorage.removeItem('authtoken');
        res.render('registerlogin', { msg: "Logout successful, please login again", errmsg: null })
    }
})

server.get("/geruserdetails/", (req, res) => {
    let token = localStorage.getItem('authtoken')

    jwt.verify(token, "This is my secret key", (err, user) => {
        let email = user.email;
        var userDB = db.getCollection('users');
        userDB.findOne({ email }).then(
            (record) => {
                // console.log(record);
                res.send({ name: record.name, email: record.email });
            }
        )

    })
})

server.post("/newsformpost/", (req, res) => {
    var newsDB = db.getCollection("news");
    newsDB.insertOne({ title: req.body.title, description: req.body.description, url: req.body.url, publishedAt: req.body.publishedAt, urlToImage: req.body.urlToImage })
        .then(() => {
            // res.render('registerlogin', { msg: null, errmsg: "Successful" })
            res.render('homepage', { alert: "News Posted" });
        },
            err => { throw new Error(err); })
})

server.get("/editnews/", (req, res) => {
    var newsDB = db.getCollection("news");
    newsDB.find({}).sort({ publishedAt: -1 }).toArray()
        .then((data) => {
            res.render('editnews', { data });
        })
})

server.get("/deletenews_execute/:id", (req, res) => {
    let to_del_id = req.params.id;
    var newsDB = db.getCollection("news");
    newsDB.findOneAndDelete ({ _id: ObjectId(to_del_id) })
        .then(()=>{
            res.redirect("/editnews/")
        })
})

server.get("/edit_news_object/:id", (req, res) => {
    let id = req.params.id;
    var newsDB = db.getCollection("news");

    newsDB.findOne({ _id : ObjectId(id) })
    .then(record => {
        res.render('edit_news_object', {record});
    })
})

server.post("/edit_newsObject/", (req, res) => {
    let id = req.body.id;
    // console.log(req.body);
    var newsDB = db.getCollection("news");
    newsDB.findOneAndUpdate({ _id : ObjectId(id) }, {$set :{ title: req.body.title, description: req.body.description, url:req.body.url, publishedAt: req.body.publishedAt, urlToImage: req.body.urlToImage }}).then(() => {
        res.redirect("/editnews/");
    },
        err => {
            console.log(err);
        });
})

// const cors = require ("cors");
// server.use(cors);

server.get("/admin/latestnews/", (req, res)=>{
    //get latest news last 3
    var newsDB = db.getCollection("news");
    newsDB.find({}).sort({time:-1}).limit(3).toArray()
        .then((data)=>{
            res.send(data);
        })
})

console.log("Server listening at 3100");