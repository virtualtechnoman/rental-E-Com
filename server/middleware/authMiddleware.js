const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const User = require("../models/user.model");
const isEmpty = require("../utils/is-empty");
const UserController = require("../controllers/user.controller");
// const privileges = require("../utils/privilege.template")(true);
const axios = require("axios");
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
                        if (doc) {
                            let u = doc.toObject();
                            // delete u.hashedPassword;
                            req.user = u;
                            res.json({ status: 200, data: u, errors: false, message: "You are already logged in!" });
                        } else {
                            res.status(403).json({ status: 403, data: null, errors: true, message: "Forbidden" });
                        }
                    })
                } catch (err) {
                    if (err) {
                        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid token" });
                    }
                }
            } else {
                // console.log("THIS");
                res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid token" })
            }
        } else {
            console.log("BODY IS ", req.body);
            result = await UserController.verifyRegister(req.body);
            if (!isEmpty(result.errors)) {
                console.log("HAS ERRORS");
                return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" });
            }
            User.findOne({ email: result.data.email }, (e, d) => {
                if (e) {
                    return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while verifying user details" })
                }
                if (d) {
                    return res.json({ status: 200, errors: true, data: null, message: "Email already exists" })
                } else {
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(result.data.password, salt, function (err, hash) {
                            if (err)
                                return res.status(500).json({ status: 500, data: null, errors: true, message: "Something went wrong with your password" });
                            result.data.password = hash;
                            result.data.wallet = 0;
                            result.data.user_id = "USR" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + Math.floor(Math.random() * (99 - 10) + 10);
                            const newUser = new User(result.data);
                            newUser.save().then(doc => {
                                doc.populate("role", (e, d) => {
                                    // const u = { _id: d._id, role: d.role._id };
                                    jwt.sign({ _id: d._id }, process.env.JWT_SECRET, function (err, token) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        else {
                                            let u = d.toObject();
                                            delete u.password;
                                            req.user = u;
                                            res.json({ message: "User registered successfully", status: 200, errors: false, data: { token, user: u } });
                                        }
                                    });
                                })
                            }).catch(e => {
                                console.log(e);
                                res.status(500).json({ message: "Error while registering user", status: 500, errors: true, data: null });
                            })
                        });
                    });
                }
            })
        }
    }
    else if (req.originalUrl === "/api/auth/register2") {
        console.log("REGISTER2")
        if (req.headers.token) {
            if (typeof req.headers.token == "string" && req.headers.token.trim() !== "") {
                try {
                    payload = jwt.verify(req.headers.token, process.env.JWT_SECRET)
                    User.findById(payload._id, "-password").populate("role").exec().then(doc => {
                        if (doc) {
                            let u = doc.toObject();
                            // delete u.hashedPassword;
                            req.user = u;
                            res.json({ status: 200, data: u, errors: false, message: "You are already logged in!" });
                        } else {
                            res.status(403).json({ status: 403, data: null, errors: true, message: "Forbidden" });
                        }
                    })
                } catch (err) {
                    if (err) {
                        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid token" });
                    }
                }
            } else {
                // console.log("THIS");
                res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid token" });
            }
        } else {
            console.log("BODY IS ", req.body);
            result = await UserController.verifyMobileRegister(req.body);
            if (!isEmpty(result.errors)) {
                console.log("HAS ERRORS");
                return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" });
            }
            let otp = Math.floor(Math.random() * (999999 - 100000) + 100000);
            let senderid = process.env.MSG_SENDER;
            let message = `Your otp is ${otp}`;
            let mobile_no = req.body.mobile_number;
            let authkey = process.env.MSG_AUTH_KEY;
            axios.post(`https://control.msg91.com/api/sendotp.php?otp=${otp}&sender=${senderid}&message=${message}&mobile=${mobile_no}&authkey=${authkey}`)
                .then(response => {
                    console.log("Response data : ", response.data);
                    if (response.data.type == "success") {
                        return res.json({ status: 200, data: null, errors: false, message: `OTP sent to ${mobile_no}` });
                    } else {
                        return res.status(400).json({ status: 400, data: null, errors: response.data, message: "Error while sending otp" })
                    }
                })
        }
    }
    else if (req.originalUrl === "/api/auth/verifyotp") {
        if (req.headers.token) {
            if (typeof req.headers.token == "string" && req.headers.token.trim() !== "") {
                try {
                    payload = jwt.verify(req.headers.token, process.env.JWT_SECRET)
                    User.findById(payload._id, "-password").populate("role").exec().then(doc => {
                        if (doc) {
                            let u = doc.toObject();
                            // delete u.hashedPassword;
                            req.user = u;
                            res.json({ status: 200, data: u, errors: false, message: "You are already logged in!" });
                        } else {
                            res.status(403).json({ status: 403, data: null, errors: true, message: "Forbidden" });
                        }
                    })
                } catch (err) {
                    if (err) {
                        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid token" });
                    }
                }
            } else {
                // console.log("THIS");
                res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid token" });
            }
        } else {
            console.log("BODY IS ", req.body);
            result = await UserController.verifyMobileOtp(req.body);
            if (!isEmpty(result.errors)) {
                console.log("HAS ERRORS");
                return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" });
            }
            let otp = result.data.otp;
            let mobile_no = result.data.mobile_number;
            let authkey = process.env.MSG_AUTH_KEY;
            axios.post(`https://control.msg91.com/api/verifyRequestOTP.php?authkey=${authkey}&mobile=${mobile_no}&otp=${otp}`).then(response => {
                if (response.data.type == "success") {
                    User.findOne({ mobile_number: result.data.mobile_number }, (err, user_found) => {
                        console.log("User : ", user_found);
                        if (err)
                            return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting user details" })
                        if (user_found) {
                            jwt.sign({ _id: user_found._id }, process.env.JWT_SECRET, function (err, token) {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while generating token" })
                                }
                                return res.json({ status: 200, data: { user: user_found, token: token }, errors: false, message: `OTP Verified` });
                            });
                        } else {
                            let newUser = {};
                            // newUser.role = 
                            newUser.mobile_number = result.data.mobile_number;
                            newUser.user_id = "USR" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + Math.floor(Math.random() * (99 - 10) + 10);
                            const u = new User(newUser);
                            u.save().then(d => {
                                console.log("User saved : ", d);
                                jwt.sign({ _id: d._id }, process.env.JWT_SECRET, function (err, token) {
                                    if (err) {
                                        console.log(err);
                                        return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while generating token" })
                                    }
                                    return res.json({ status: 200, data: { user: d, token: token }, errors: false, message: `OTP Verified` });
                                });
                            }).catch(e => {
                                console.log("Error while saving the user : ", e);
                                return res.status(500).json({ status: 500, data: null, errors: false, message: `Error while saving the user` })
                            })
                        }
                    })
                } else {
                    res.status(400).json({ status: 400, data: null, errors: response.data, message: "Error while sending otp" })
                }
            })
        }
    }
    // else if (req.originalUrl === "/api/auth/login2") {
    //     // console.log("LOGIN ROUTE")
    //     if (req.headers.token != undefined) {
    //         if (typeof req.headers.token == "string" && req.headers.token.trim() !== "") {
    //             // console.log("HAS TOKEN");
    //             if (req.method === "POST") {
    //                 jwt.verify(req.headers.token, process.env.JWT_SECRET, (err, payload) => {
    //                     if (err) {
    //                         console.log(err);
    //                         res.json({ message: "Invalid token" })
    //                     } else {
    //                         User.findById(payload._id, (err, doc) => {
    //                             if (err) {
    //                                 return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while validating your token details" })
    //                             }
    //                             if (doc) {
    //                                 let u = doc.toObject();
    //                                 delete u.password;
    //                                 req.user = u;
    //                                 res.json({ status: 200, data: u, errors: false, message: "You are already logged in!" });
    //                             } else {
    //                                 return res.json({ message: "Error while validating your token details" })
    //                             }
    //                         })
    //                     }
    //                 })
    //             } else {
    //                 res.json({ message: "INVALID ROUTE" });
    //             }
    //         } else {
    //             res.json({ message: "invalid token" });
    //         }
    //     } else {
    //         let result = UserController.verifyMobileLogin(req.body);
    //         // console.log("NO TOKEN");
    //         if (!isEmpty(result.errors)) {
    //             return res.json(result.errors);
    //         }
    //         User.findOne({ mobile_number: result.data.mobile_number }, (err, user) => {
    //             console.log(user)
    //             if (err) {
    //                 return res.json({ message: "Error while finding the user" });
    //             }
    //             if (user) {
    //                 let otp = Math.floor(Math.random() * (999999 - 100000) + 100000);
    //                 let senderid = process.env.MSG_SENDER;
    //                 let message = `Your login otp is ${otp}`;
    //                 let mobile_no = req.body.mobile_number;
    //                 let authkey = process.env.MSG_AUTH_KEY;
    //                 axios.post(`https://control.msg91.com/api/sendotp.php?otp=${otp}&sender=${senderid}&message=${message}&mobile=${mobile_no}&authkey=${authkey}`).then(response => {
    //                     if (response.data.type == "success") {
    //                         return res.json({ status: 200, data: null, errors: false, message: `OTP sent to ${mobile_no}` });
    //                     } else {
    //                         res.status(400).json({ status: 400, data: null, errors: response.data, message: "Error while sending otp" })
    //                     }
    //                 }).catch(e => {
    //                     console.log(e);
    //                     res.status(500).json({ status: 500, data: null, errors: true, message: "Something went wrong" });
    //                 })
    //             } else {
    //                 res.json({ status: 200, errors: true, data: null, message: "User not exist" });
    //             }

    //         })
    //     }
    // }
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
                                    return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while validating your token details" })
                                }
                                if (doc) {
                                    let u = doc.toObject();
                                    delete u.password;
                                    req.user = u;
                                    res.json({ status: 200, data: u, errors: false, message: "You are already logged in!" });
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
                                jwt.sign({ _id: u._id }, process.env.JWT_SECRET, function (err, token) {
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
            console.log("THIS CALLED");
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