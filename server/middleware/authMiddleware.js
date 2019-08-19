const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
// const bcrypt = require('bcryptjs');
// const isEmpty = require("../utils/is-empty");
// const UserController = require("../controllers/user.controller");
// const axios = require("axios");
// const moment = require("moment");
// const privileges = require("../utils/privilege.template")(true);

module.exports = async (req, res, next) => {
    // let payload;
    console.log("ELSE PART");
        if (req.headers.token) {
            if (typeof req.headers.token == "string" && req.headers.token.trim() !== "") {
                console.log("HAS TOKEN");
                // if (req.method === "POST") {
                jwt.verify(req.headers.token, process.env.JWT_SECRET, (err, payload) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({ status:400, data:null, errors:true, message: "Invalid token" })
                    } else {
                        User.findById(payload._id).populate("role").exec().then(d => {
                            // console.log("FUNCTION EXECUTED")
                            if (d) {
                                let u = d.toObject();
                                delete u.password;
                                req.user = u;
                                console.log(u);
                                next();
                            } else {
                                res.status(403).json({ status:403, data:null, errors:true, message: "Your token is not valid anymore" });
                            }
                        }).catch(e => {
                            if (e) {
                                return res.status(500).json({ status:500, data:null, errors:true, message: "Error while retriving user details" })
                            }
                        });
                    }
                })
            } else {
                res.status(400).json({ status:400, data:null, errors:true, message: "Invalid token" })
            }
        } else {
            res.status(401).json({ status:401, data:null, errors:true, message: "Unauthorized" })
        }
}
    // if (req.originalUrl === "/api/auth/register") 
    // else if (req.originalUrl === "/api/auth/register2") 
    // else if (req.originalUrl === "/api/auth/verifyotp") 
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
    // else if (req.originalUrl === "/api/auth/login") 
    // else if (req.originalUrl === "/api/auth/me") 
    
        