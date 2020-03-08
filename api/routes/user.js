const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../controllers/user.controller.js");
const multer = require('multer');
var mkdirp = require('mkdirp');

// Create a new User
router.post("/signup", User.create);
router.post("/login", User.login);
router.get("/usersCreatedBy/:user_id", User.usersCreatedBy);
router.get("/getAllCoachByGym/:id_gym", User.getAllCoachByGym);
router.delete("/deleteUser/:user_id", User.deleteUser);
router.post("/approveUser/:user_id", User.approveUser);

router.post("/loginjwt", User.loginjwt);
// Retrieve all users
router.get("/", User.findAll);

//Uploads Apis
router.post('/UploadDoc', function (req, res) {

  var storage = multer.diskStorage({
    destination: function(req, file, cb){

      var dist = 'public/uploads/';
        cb(null, dist);
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);

    },


  });
var upload = multer({ storage:  storage}).single('image');
  upload(req, res, function (err) {
      var foldername = req.body.cin;
      var imageName = req.file.filename
      var imageType = req.body.imageType;
  mkdirp('public/uploads/'+foldername, function (err) {
    if (err){
       return res.status(404).json({
        status: false,
        message: "Upload failure",
      });
    }
});
    //moves the $file to $dir2
var moveFile = (file, dir2)=>{
  //include the fs, path modules
  var fs = require('fs');
  var path = require('path');

  //gets file name and adds it to dir2
  var dest = path.resolve(dir2, imageType+"-"+foldername+".jpg");

  fs.rename(file, dest, (err)=>{
    if(err){
      return res.status(404).json({
        status: false,
        message: "Upload failure",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Upload Succesfull",
    });
  });
};
//move file1.htm from 'test/' to 'test/dir_1/'
moveFile('public/uploads/'+imageName, 'public/uploads/'+foldername);


  })

});

module.exports = router;
