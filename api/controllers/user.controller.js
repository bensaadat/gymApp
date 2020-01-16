const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const  multer = require('multer');
var mkdirp = require('mkdirp');

//------------------------------------------------------------------------------
// Create and Save a new User
    exports.create = (req, res) => {
        // Validate request 
        if (!req.body) {
        res.status(400).send({
          status: false,
          message:"Content can not be empty!"
        });
        }
        // hash password
        bcrypt.hash(req.body.password, 10, function(err, hash) {
          console.log(req.body.password);
            if (err) {
                return res.status(500).json({
                  status: false,
                  message:   err
                });
              } else {
                 // Create a User
                const user = new User({
                    city: req.body.city,
                    vehicle: req.body.vehicle,
                    min_orders: req.body.min_orders,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    phone: req.body.phone,
                    birthday: req.body.birthday,
                    email: req.body.email,
                    password: hash,
                    cin: req.body.cin,
                    deposit: req.body.deposit,
                    bank_account_title: req.body.bank_account_title,
                    bank_account_number: req.body.bank_account_number,
                    bank_name: req.body.bank_name,
                    about_us: req.body.about_us
                    
      
                });
                // Save User in the database
                    User.create(user, (err, data) => {
                        if (err)
                        return res.status(404).json({
                          status: false,
                          message:   err.message,
                        });
                        else{
                          basUrl =  req.protocol + '://' + req.headers.host ;
                          User.userObject(basUrl, data.cin, (data1) => { 
                              return res.status(200).json({
                                status: true,
                                message: "Success",
                                data: data1
                              });
                          });
                          
                        }
                        });
              }
        });
  };
//----------------------------------------------------------------------------------------------------------
  // Logine  User without jwt ( Token )
    exports.loginjwt = (req, res, next) => {
      User.findUser(req.body.Email, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              status: false,
              message:`Not found User with id ${req.body.Email}.`,
              data: []
         
            });
          } else {
            res.status(500).send({
                status: false,
                message: "Error request ",
                data: []
         
            });
          }
        } else {
          
          bcrypt.compare(req.body.password, data.password, function(err, result) {
            if(result) {
           const token =  jwt.sign({
                email: 'bensaadat.amine@gmail.com',
                userId: "4"
              },   
              "secret",
              {
                expiresIn: "1h"
              }
              );
              return res.status(401).json({
                status: true,
                message: token,
                token: token,
                data: data
              });
      
            } else {
              return res.status(401).json({
                status: false,
                message: "failed",
                data: []
                }); 
            } 
          }); 
        }
      }); 
      }
//--------------------------------------------------------------------------------------------------------------------------------
        // Logine  User without jwt
    exports.login = (req, res, next) => {
     
      
      User.findUser(req.body.username, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              status: false,
              message:`Not found User with username ${req.body.username}.`,
              data: []
         
            });
          } else {
            res.status(500).send({
                status: false,
                message: "Error request ",
                data: []
            });
          }
          
          
        } else {
          
          bcrypt.compare(req.body.password, data.password, function(erreur, result) {
            
            if(result) {
              basUrl =  req.protocol + '://' + req.headers.host ;
              User.userObject(basUrl, data.cin, (data1) => { 
                return res.status(200).json({
                  status: true,
                  message: "Success",
                  data: data1
                });
          });
              
      
            } else {
              return res.status(401).json({
                status: false,
                message: "password  is invalide",
                data: []
                }); 
            } 
          }); 
        }
      }); 
      }
//-----------------------------------------------------------------------------------------------------------------
// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  User.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving customers."
        });
      else res.send(data);
    });
};

// check if exist CIN
exports.checkCin = (req, res) => {
  User.checkCin(req.params.cin, (err, data) => {
    console.log(data.cin);
  if(data.cin){
    return res.status(404).json({
      status: false,
      message: "cin already exist",
    });
  }
  return res.status(200).json({
    status: true,
    message: "cin doesnt exist",
  });
  
  });
};
//------------------------------------------------------------------------------------------------

// changePassword
exports.changePassword = (req, res) => {
      
  User.findUser(req.body.login, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          status: false,
          message:`Not found User with username ${req.body.login}.`,
          data: []
     
        });
      } else {
        res.status(500).send({
            status: false,
            message: "User not found  ",
        });
      }
    } else {
      
      bcrypt.compare(req.body.password, data.password, function(erreur, result) {
        
        if(result) {
         // hash password
         bcrypt.hash(req.body.newPassword, 10, function(err, hash) {
            if (err) {
                return res.status(500).json({
                  status: false,
                  message:   err
                });
              } else {
                User.updatePassword(hash, req.body.login, (err, data) => {
                  console.log(hash);
                return res.status(200).json({
                  status: true,
                  password:   hash
                });     

                });
                
              }
        });

        } else {
          return res.status(401).json({
            status: false,
            message: "password  is invalide",
            data: []
            }); 
        } 
      }); 
    }
  }); 
};
//------------------------------------------------------------------------------------------------
// check if exist Phone
exports.checkPhnoe = (req, res) => {
  User.checkPhnoe(req.params.phone, (err, data) => {
    if(data.phone){
      return res.status(404).json({
        status: false,
        message: "Phone already exist"
      });
    }
    return res.status(200).json({
      status: true,
      message: "Phnoe doesnt exist",
    });
});
};
//--------------------------------------------------------------------------------------------------
// check if exist Email
exports.checkEmail = (req, res) => {
  User.checkEmail(req.params.email, (err, data) => {
    
  if(data.email){
    return res.status(404).json({
      status: false,
      message: "Email already exist",
    });
  }
  return res.status(200).json({
    status: true,
    message: "Email doesnt exist",
  });
  });
//--------------------------------------------------------------------------------------------------

};
// user profile
exports.profile = (req, res) => {
  basUrl =  req.protocol + '://' + req.headers.host ;
  User.userObject(basUrl, req.body.cin, (data)  => {
  if(data.cin){
    return res.status(200).json({
      status: true,
      message: "user exist",
      data : data
    });
  }
  return res.status(404).json({
    status: false,
    message: "user doesnt exist",
    data: []
  });
  
  });
};




