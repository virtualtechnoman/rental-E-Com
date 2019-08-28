const router = require("express").Router();
const AWS = require("aws-sdk");
const uuid = require("uuid/v1");
const authorizePrivilege = require("../middleware/authorizationMiddleware");
const S3 = new AWS.S3({
    accessKeyId:process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey:process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION
})
router.get("/brand", authorizePrivilege("ADD_NEW_PRODUCT"), (req, res) => {
    let k = `brands/${uuid()}.jpeg`;
    S3.getSignedUrl('putObject', {
        Bucket: 'binsar',
        ContentType: 'jpeg',
        Key: k
    }, (err, url) => {
        if(err){
            console.log(err);
           return res.status(500).json({status:500, data:null, errors:true, message:"Error while uploading image"});
        }
        res.json({status:200, data: {key: k, url}, errors:false, message:"Upload the image to given url" });
    })
})
router.get("/product", authorizePrivilege("ADD_NEW_PRODUCT"), (req, res) => {
    let k = `products/${uuid()}.jpeg`;
    S3.getSignedUrl('putObject', {
        Bucket: 'binsar',
        ContentType: 'jpeg',
        Key: k
    }, (err, url) => {
        if(err){
            console.log(err);
           return res.status(500).json({status:500, data:null, errors:true, message:"Error while uploading image"});
        }
        res.json({status:200, data: {key: k, url}, errors:false, message:"Upload the image to given url" });
    })
})
router.get("/profile", authorizePrivilege("UPDATE_USER_OWN"), (req, res) => {
    let k = `profile-pictures/${req.user._id}/${uuid()}.jpeg`;
    S3.getSignedUrl('putObject', {
        Bucket: 'binsar',
        ContentType: 'jpeg',
        Key: k
    }, (err, url) => {
        if(err){
            console.log(err);
           return res.status(500).json({status:500, data:null, errors:true, message:"Error while uploading image"});
        }
        res.json({status:200, data: {key: k, url}, errors:false, message:"Upload the image to given url" });
    })
})

router.get("/profile/:id", authorizePrivilege("UPDATE_USER"), (req, res) => {
    let k = `profile-pictures/${req.params.id}/${uuid()}.jpeg`;
    S3.getSignedUrl('putObject', {
        Bucket: 'binsar',
        ContentType: 'jpeg',
        Key: k
    }, (err, url) => {
        if(err){
            console.log(err);
           return res.status(500).json({status:500, data:null, errors:true, message:"Error while uploading image"});
        }
        res.json({status:200, data: {key: k, url}, errors:false, message:"Upload the image to given url" });
    })
})
router.get("/customer/profile", authorizePrivilege("UPDATE_CUSTOMER"), (req, res) => {
    let k = `profile-pictures/${req.user._id}/${uuid()}.jpeg`;
    S3.getSignedUrl('putObject', {
        Bucket: 'binsar',
        ContentType: 'jpeg',
        Key: k
    }, (err, url) => {
        if(err){
            console.log(err);
           return res.status(500).json({status:500, data:null, errors:true, message:"Error while uploading image"});
        }
        res.json({status:200, data: {key: k, url}, errors:false, message:"Upload the image to given url" });
    })
})
module.exports = router;