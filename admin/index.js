const express = require("express");
const bodyParser = require("body-parser");
const db = require("./config/mongodb");
const path = require("path");
const localStorage = require('node-localstorage').LocalStorage('./scratch');
// const localStorage = new LocalStorage('./scratch');

const jwt = require("jsonwebtoken");

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
    if(!token){
        res.render('registerlogin', { msg: null, errmsg: null });
    } else {
        jwt.verify(token, "This is my secret key",(err, user)=>{
            let email = user.email;
            var userDB = db.getCollection('users');
            userDB.findOne({ email }).then(
                (record) => {
                    if (record) {
                        //success
                        res.render('homepage')
                    }
                    else {
                        res.render('registerlogin', { msg: null, errmsg: null })
                    }
                }
            )

        })        
    }

    // res.render('registerlogin', { msg: null, errmsg: null })
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
                        expiresIn: '2h'
                    }
                );
                const response = {
                    email: record.email,
                    id: record._id,
                    token: token
                }
                localStorage.setItem('authtoken', token)
                res.render('homepage');
            } else {
                res.render('registerlogin', { msg: "Wrong_Password", errmsg: null })
            }
        })
});

server.get("/logout/", (req, res)=>{
    let token = localStorage.getItem('authtoken')
    if(!token){
        res.render('registerlogin', { msg: null, errmsg: null });
    } else {
        localStorage.removeItem('authtoken');
        res.render('registerlogin', { msg: "Logout successful, please login again", errmsg: null })
    }
})

console.log("Server listening at 3100");