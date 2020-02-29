const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const  multer = require('multer');
const fs = require('fs');
const handlebars = require('handlebars');
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
      User.findUser(req.body.username, (err, user) => {
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
          bcrypt.compare(req.body.password, user.password, function(erreur, result) {
            
            if(result) {
                return res.status(200).json({
                  status: true,
                  message: "Success",
                  data: user
                  
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
      if(req.body.login != null) {
  User.findUser(req.body.login, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          status: false,
          message:`Not found User with username ${req.body.login}.`,    
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
                  message: "Password has been changed sucessfully"
                });     

                });
                
              }
        });

        } else {
          return res.status(401).json({
            status: false,
            message: "password  is invalide",
            }); 
        } 
      }); 
    }
  }); 
} else {
  User.findUserByToken(req.body.forgetPasswordToken, (err, data) => {
    if (err) {
      return res.status(404).json({
        status: false,
        message: "Password Token is invalid",
      });
      
    } else {
      var current_time = new Date().getTime() / 1000;
      var Token_Expire = data.forgetPasswordDateTime;
      if (Token_Expire > current_time) {
        bcrypt.hash(req.body.password, 10, function(err, hash) {
          if (err) {
              return res.status(500).json({
                status: false,
                message:   err
              });
            } else {
              User.updateTokenAndDatime("", "", data.cin, (err1, result) => {
                User.updatePassword(hash, data.cin, (err, data1) => {
                  return res.status(200).json({
                    status: true,
                    message: "Password has been changed sucessfully"
                  });     
                });
              });    
            }
        });
      }else{
        return res.status(400).json({
          status: false,
          message: "Password Token is Expired"
        });
      }
     
    }
  });
}
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
// user profile---------------------------------------------------------------------------------------
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

       // user resetPassword---------------------------------------------------------------------------------------
       exports.resetPassword = (req, res) => {
           // check if autorize
           User.findUserByToken(req.body.forgetPasswordToken, (err, data) => {
            if (err) {
              return res.status(404).json({
                status: false,
                message: "Password Token is invalid",
              });
              
            } else {
              var current_time = new Date().getTime() / 1000;
              var Token_Expire = data.forgetPasswordDateTime;
              if (Token_Expire > current_time) {
                return res.status(200).json({
                  status: true,
                  message: "Password Token is Valid"
                });
              }else{
                return res.status(400).json({
                  status: false,
                  message: "Password Token is Expired"
                });
              }
             
            }
          });
        };

    
        
    // user availability---------------------------------------------------------------------------------------
       exports.availability = (req, res) => {
        // check availability 
        User.availability(req.body.cin, (err, data) => {
         if (err) {
           return res.status(404).json({
             status: false,
             message: err
           });
           
         } else {
          return res.status(200).json({
            status: true,
            availability: data,
          });
          
         }
       });
     };
      
     //user save availability---------------------------------------------------------------------------------------
       exports.saveAvailability = (req, res) => {
        // check availability 
        User.saveAvailability(req.body.cin, req.body.availability, (data) => {
         if (data) {
          return res.status(200).json({
            status: true,
            message: "data Updated",
          });
         }
       });
     };
      
      // user forget_Password---------------------------------------------------------------------------------------
          exports.forget_Password = (req, res) => {
          // check if autorize
          User.findUser(req.body.username, (err, data) => {
            if (err) {
              return res.status(404).json({
                status: false,
                message: "No autorized",
              });
              
            } else {
              // if User id autorize
                // generate the URl with forgetPasswordToken
                var current_time = new Date().getTime() / 1000,
                    Token_Expire = current_time + 7200000 ,
                    url = req.protocol + '://' + req.headers.host+"/user/reset_password/" ;
                    cin = data.cin,
                    phone = replace_first_digit(data.phone),
                    hash = hashMethode(cin),// hash Token_Expire
                    console.log(url+hash);
		                resetURL = url+hash;
		    smsMessage = "Vous avez demandé à changer le mot de passe de votre compte Shipplo. Pour créer un nouveau mot de passe, cliquez sur le lien: "+ resetURL;
                    smsObject = {from: "Shipplo", to : phone, text : smsMessage}; // message sms
                    // call function send sms
                    sendSms(smsObject);
                    
                    console.log(req.headers.host);
                    console.log(data.email);

                    if(req.headers.host == "shipplo.goprot.com") {
                      sendEmail(resetURL,data.email, data.first_name, data.last_name, 'Réinitialisez votre mot de passe shipplo');
                    }
                    // update in to the database tables column
                    User.updateTokenAndDatime(hash, Token_Expire, cin, (err1, result) => {
                      if (err1) {
                        return res.status(500).json({
                          status: false,
                          message: err1
                        });
                      }else{
                        console.log(phone);
                        return res.status(200).json({
                          status: true,
                          message: 'data updated',
                        });
                      }
                    });    
            }
          });


        // ---------- Function replace_first_digit ---------------------
        function replace_first_digit(input_str) {
          return input_str.replace(/[0-9]/, '+212');
        }

          // ---------- Function sendSms ---------------------
        sendSms = function(message) {
            var infobip = require('infobip');
            //Initialize the client
            var client = new infobip.Infobip('amine.goprot', 'Monegmail1');
            //Send an SMS
            client.SMS.send(message,function(err, response){
              if(err){
                return false;
              }else{
                return true
              }
            });
          }

         // ---------- Function hashMethode ---------------------
        hashMethode = function(string) {
          const saltRounds = 10;
          var salt = bcrypt.genSaltSync(saltRounds);
          var hash = bcrypt.hashSync(""+string+"", salt);
     
        return hash;
        }

         // ---------- Function compare hash ---------------------
         compareMethode = function(hash) {

          bcrypt.compare(guess, stored_hash, function(err, res) {
            

          });

          const saltRounds = 10;
          var salt = bcrypt.genSaltSync(saltRounds);
          var hash = bcrypt.hashSync(""+string+"", salt);
     
        return hash;
          }
        };
 
        // send email
          sendEmail = function(url, to, firstName, lastName, subject) {
          
          	var transporter = nodemailer.createTransport({
        			host: 'localhost',
        			port: 25,
        			secure: false, // true for 465, false for other ports
        			auth: {
            			user: '', // generated ethereal user
            			pass: ''  // generated ethereal password
        			},
        			tls:{
          				rejectUnauthorized:false
        		}
  			   });

  var readHTMLFile = function(path, callback) {
    console.log(path);
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
  };

    readHTMLFile('./api/views/emailTemplates/forgotPasswordTemplate.html', function(err, html) {

    var template = handlebars.compile(html);
    var replacements = {
         username: firstName+ " " + lastName,
         url: url
    };
    var htmlToSend = template(replacements);
    
    var mailOptions = {
      from: 'no-reply@goprot.com',
      to: to,
      subject: subject,
      html: htmlToSend
    };  

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log('Email not sent');
        return false;
      } else {
        console.log('Email sent: ' + info.response);
        return false;
      }
    });
  });
};


    // user creted by ---------------------------------------------------------------------------------------
    exports.usersCreatedBy = (req, res) => {
      // check availability 
      User.usersCreatedBy(req.params.user_id, (err, data) => {
        console.log(data);
        
       if (err) {
         return res.status(404).json({
           status: false,
           message: err
         });
         
       } else {
        return res.status(200).json({
          status: true,
          data: data,
        });
        
       }
     });
   };

      // user creted by ---------------------------------------------------------------------------------------
    exports.getAllCoachByGym = (req, res) => {
        // check availability 
        User.getAllCoachByGym(req.params.id_gym, (err, data) => {
         if (err) {
           return res.status(404).json({
             status: false,
             message: err
           });
           
         } else {
          return res.status(200).json({
            status: true,
            data: data,
          });
          
         }
       });
     };
    
           // user creted by ---------------------------------------------------------------------------------------
    exports.getGymByCoach = (req, res) => {
      // check availability 
      User.getGymByCoach(req.params.user_id, (err, data) => {
       if (err) {
         return res.status(404).json({
           status: false,
           message: err
         });
         
       } else {
        return res.status(200).json({
          status: true,
          data: data,
        });
        
       }
     });
   };

      // user creted by ---------------------------------------------------------------------------------------
      exports.deleteUser = (req, res) => {
        // check availability 
        User.deleteUser(req.params.user_id, (err, data) => {
         if (err) {
           return res.status(404).json({
             status: false,
             message: err
           });
           
         } else {
          return res.status(200).json({
            status: true,
            message: "data user deleted"
          });
          
         }
       });
     };

        // user creted by ---------------------------------------------------------------------------------------
        exports.approveUser = (req, res) => {
          // check availability 
          User.approveUser(req.body.user_id, (err, data) => {
           if (err) {
             return res.status(404).json({
               status: false,
               message: err
             });
             
           } else {
            return res.status(200).json({
              status: true,
              message: "data user deleted"
            });
            
           }
         });
       };
  