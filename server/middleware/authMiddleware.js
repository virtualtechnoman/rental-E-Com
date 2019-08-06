const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const User = require("../models/user.model");
const isEmpty = require("../utils/is-empty");
const UserController = require("../controllers/user.controller")
const moment = require("moment");

module.exports = async (req, res, next) => {
    let payload;
    if (req.originalUrl === "/api/auth/register") {
        console.log("REGISTER")
        if (req.headers.token) {
            if (typeof req.headers.token == "string" && req.headers.token.trim() !== "") {
                try {
                    payload = jwt.verify(req.headers.token, process.env.JWT_SECRET)
                    User.findById(payload._id, "-password").populate("role").exec().then(doc => {
                        let u = doc.toObject();
                        // delete u.hashedPassword;
                        req.user = u;
                        res.json({ message: "You are already logged in!" });
                    })
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
            User.findOne({ email: result.data.email }, (e, d) => {
                if (e) {
                    return res.json({ message: "Error while verifying user details" })
                }
                if (d) {
                    return res.json({ message: "Email already exists" })
                } else {
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(result.data.password, salt, function (err, hash) {
                            if (err)
                                return res.json({ message: "Something went wrong with your password" });
                            result.data.password = hash;
                            result.data.wallet = 0;
                            result.data.user_id = "USR" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + Math.floor(Math.random() * (99 - 10) + 10);
                            const newUser = new User(result.data);
                            newUser.save().then(doc => {
                                doc.populate("role", (e, d) => {
                                    const u = { _id: d._id, role: d.role._id };
                                    jwt.sign(u, process.env.JWT_SECRET, function (err, token) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        else {
                                            let u = d.toObject();
                                            delete u.password;
                                            req.user = u;
                                            res.json({ message: "User registered successfully", token, user: u });
                                        }
                                    });
                                })

                            }).catch(e => {
                                console.log(e);
                                res.json({ message: "Error while registering user" });
                            })
                        });
                    });
                }
            })
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
                            User.findById(payload._id, (err, doc) => {
                                if (err) {
                                    return res.json({ message: "Error while validating your token details" })
                                }
                                if (doc) {
                                    let u = doc.toObject();
                                    delete u.password;
                                    req.user = u;
                                    res.json({ message: "You are already logged in!", user: u });
                                } else {
                                    return res.json({ message: "Error while validating your token details" })
                                }
                            })
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
            let result = UserController.verifyLogin(req.body);
            // console.log("NO TOKEN");
            if (!isEmpty(result.errors)) {
                return res.json(result.errors);
            }
            if (req.body.email && req.body.password) {
                let email = req.body.email.trim();
                console.log("BODY IS ", req.body);
                console.log("Email IS ", email);
                User.findOne({ email: email }, (err, user) => {
                    console.log(user)
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
                                const u = user.toObject();//{ _id: user._id, role: user.role }
                                delete u.password;
                                // console.log("USER MATCHED");
                                req.user = u;
                                jwt.sign(u, process.env.JWT_SECRET, function (err, token) {
                                    if (err) {
                                        console.log(err);
                                        res.json({ message: "Error while generating token" })
                                    }
                                    else {
                                        user = user.toObject();
                                        delete user.password;
                                        req.user = user;
                                        res.json({ message: "Login successfull", token, user })
                                    }
                                });
                            } else {
                                return res.status(401).json({ message: "Invalid Credentials" });
                            }
                        });
                    } else {
                        res.json({ message: "User not exist" });
                    }

                })
                // let password = req.body.password;
                // User.find({ email: email, })
            }
        }
    }
    else if (req.originalUrl === "/api/auth/me") {
        if (req.headers.token) {
            if (typeof req.headers.token == "string" && req.headers.token.trim() !== "") {
                // console.log("HAS TOKEN");
                // if (req.method === "GET") {
                jwt.verify(req.headers.token, process.env.JWT_SECRET, (err, payload) => {
                    if (err) {
                        console.log(err);
                        res.json({ message: "Invalid token" })
                    } else {
                        // req.user = payload;
                        User.findById(payload._id, (e, d) => {
                            if (e) {
                                res.json({ message: "Error while retriving user details" })
                            }
                            if (d) {
                                d = d.toObject();
                                delete d.password;
                                req.user = d;
                                res.json({ user: d })
                            }
                            else {
                                res.json({ message: "Your token is not valid anymore" });
                            }
                        })
                        // res.json({ user: payload });
                    }
                })
                // } else {
                //     res.json({ message: "INVALID ROUTE" });
                // }
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
                        return res.json({ message: "Invalid token" })
                    } else {
                        User.findById(payload._id).populate("role").exec().then(d => {
                            // console.log("FUNCTION EXECUTED")
                            if (d) {
                                let u = d.toObject();
                                delete u.password;
                                req.user = u;
                                // console.log("user data :  ",req.user);
                                next();
                            } else {
                                return res.json({ message: "Your token is not valid anymore" })
                            }
                        }).catch(e => {
                            if (e) {
                                return res.json({ message: "Error while verifying your token details" });
                            }
                        });

                        // req.user = payload;
                        // res.json({ message: "You are already logged in!" , user:payload});
                        // next();
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