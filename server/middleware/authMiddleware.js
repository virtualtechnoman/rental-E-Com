const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const User = require("../models/user.model");
const isEmpty = require("../utils/is-empty");
const UserController = require("../controllers/user.controller")

module.exports = async (req, res, next) => {
    let payload;
    if (req.originalUrl === "/api/auth/register") {
        console.log("REGISTER")
        if (req.headers.token) {
            if (typeof req.headers.token == "string" && req.headers.token.trim() !== "") {
                try {
                    payload = jwt.verify(req.headers.token, process.env.JWT_SECRET)
                    req.user = payload;
                    res.json({ message: "You are already logged in!" });
                } catch (err) {
                    if (err) {
                        res.json({ message: "Invalid token" })
                    }
                }
            } else {
                console.log("THIS");
                res.json({ message: "invalid token" })
            }
        } else {
            console.log("BODY IS ", req.body);
            result = await UserController.verifyRegister(req.body);
            if (!isEmpty(result.errors)) {
                console.log("HAS ERRORS");
                return res.json(result.errors);
            }
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(result.data.password, salt, function (err, hash) {
                    if(err)
                    return res.json({message:"Something went wrong with your password"});
                    result.data.password = hash;
                    result.data.wallet = 0;
                    const newUser = new User(result.data);
                    newUser.save().then(doc => {
                        const u = { _id: doc._id, role: doc.role }
                        req.user = u;
                        jwt.sign(u, process.env.JWT_SECRET, function (err, token) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                res.json({ message: "User registered successfully", token })
                            }
                        });
                    }).catch(e => {
                        console.log(e);
                        res.json({ message: "Error while registering user" });
                    })
                });
            });
        }
    }
    else if (req.originalUrl === "/api/auth/login") {
        // console.log("LOGIN ROUTE")
        if (req.headers.token != undefined) {
            if (typeof req.headers.token == "string" && req.headers.token.trim() !== "") {
                // console.log("HAS TOKEN");
                if (req.method === "POST") {
                    jwt.verify(req.headers.token, process.env.JWT_SECRET, (err, payload) => {
                        if (err) {
                            console.log(err);
                            res.json({ message: "Invalid token" })
                        } else {
                            req.user = payload;
                            res.json({ message: "You are already logged in!", user: payload });
                            // next();
                        }
                    })
                } else {
                    res.json({ message: "INVALID ROUTE" });
                }
            } else {
                res.json({ message: "invalid token" });
            }
        } else {
            // console.log("NO TOKEN");
            if (req.body.email && req.body.password) {
                let email = req.body.email.trim();
                // console.log("BODY IS ",req.body);
                User.findOne({ email: email }, (err, user) => {
                    
                    if (err) {
                        return res.json({ message: "Error while finding the user" });
                    }
                    if (user) {
                        // console.log("USER FOUND")
                        bcrypt.compare(req.body.password, user.password, function (er, isMatched) {
                            // console.log("USER : ",user);
                            // console.log("BCRYPT RES : ",doc);
                            // console.log("BCRYPT");
                            if (er) {
                                // console.log("ERROR IN BCRYPT")
                                return res.status(401).json({ message: "Error in validating Credentials" });
                            }
                            if (isMatched) {
                                const u = { _id: user._id, role: user.role }
                                // console.log("USER MATCHED");
                                req.user = u;
                                jwt.sign(u, process.env.JWT_SECRET, function (err, token) {
                                    if (err) {
                                        console.log(err);
                                        res.json({message:"Error while generating token"})
                                    }
                                    else {
                                      user = user.toObject();
                                      delete user.password;
                                        res.json({ message: "Login successfull", token, user })
                                    }
                                });
                            }else{
                                return res.status(401).json({ message: "Invalid Credentials" });
                            }
                        });
                    }else{
                        res.json({message:"User not exist"});
                    }
                    
                })
                let password = req.body.password;
                User.find({ email: email, })
            }
        }
    }
    else if (req.originalUrl === "/api/auth/me") {
        if (req.headers.token) {
            if (typeof req.headers.token == "string" && req.headers.token.trim() !== "") {
                // console.log("HAS TOKEN");
                if (req.method === "GET") {
                    jwt.verify(req.headers.token, process.env.JWT_SECRET, (err, payload) => {
                        if (err) {
                            console.log(err);
                            res.json({ message: "Invalid token" })
                        } else {
                            req.user = payload;
                            User.findById(req.user._id,(e,d)=>{
                                if(e){
                                    res.json({message:"Error while retriving user details"})
                                }
                                if(d){
                                    d = d.toObject();
                                    delete d.password;
                                    res.json({user:d})
                                }
                                else{
                                    res.json({message:"User does not exist"});
                                }
                            })
                            res.json({ user: payload });
                        }
                    })
                } else {
                    res.json({ message: "INVALID ROUTE" });
                }
            } else {
                res.json({ message: "invalid token" })
            }
        } else {
            res.status(401).json({ message: "Unauthorized" })
        }
    }
    else {
        console.log("ELSE PART");
        if (req.headers.token) {
            if (typeof req.headers.token == "string" && req.headers.token.trim() !== "") {
                console.log("HAS TOKEN");
                // if (req.method === "POST") {
                jwt.verify(req.headers.token, process.env.JWT_SECRET, (err, payload) => {
                    if (err) {
                        console.log(err);
                        res.json({ message: "Invalid token" })
                    } else {
                        req.user = payload;
                        // res.json({ message: "You are already logged in!" , user:payload});
                        next();
                    }
                })
                // }else{
                //     res.json({message:"INVALID ROUTE"});
                // }
            } else {
                res.json({ message: "invalid token" })
            }
        } else {
            res.status(401).json({ message: "Unauthorized" })
        }
    }
    // console.log("METHOD : ", req.method)
    // console.log("TOKEN : ", req.headers.token);
    // console.log("URI : ", req.originalUrl);
    // next();
}