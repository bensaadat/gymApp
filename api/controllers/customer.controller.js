const nodemailer = require('nodemailer');
const Customer = require("../models/customer.model");
const Orders =  require('../models/orders.model'); // call model orders


// Function getCustomerLocation---------------------------------------------------------------------------------------
exports.saveCustomerLocation = (req, res) => {


    var latitude = req.body.latitude;
    var longitude = req.body.logtitude;
    var trackingNumber = req.body.trackingNumber;
    var order_id = req.body.entity_id;
    var comment = req.body.comment;
    var shipperId = 1;

    // console.log(latitude);
    // console.log(longitude);
    // console.log(trackingNumber);
    // console.log(order_id);

    Orders.addComment( order_id, currentDate(), comment, shipperId, (data)  => {
     
      if(data){
        console.log(data)
        Customer.saveCustomerLocation(order_id , latitude, longitude);
      return res.status(200).json({
        status: true,
        message: "comment added",
      });
    }else{
      return res.status(404).json({
        status: false,
        message: "Statu Not Changed",
      });
    }
  });
  

 };
 //------------ End Function


 // --------- check order mode ----------------
 exports.checkOrderMode = (req, res) => {
  // check staus is in delevry 
       // call function checkOrderMode
       Orders.SingleOrdesBybarcode(req.body.increment_id,(Data, err) => {
        if(Data){
          return res.status(200).json({
            status: true,
            message: "Success",
            data : Data
          });
        }else{
          return res.status(200).json({
            status: false,
             data: []
          });
        }
  
      });


  }


  
// ---------- Function currentDate ---------------------
currentDate = function() {
  // current timestamp in milliseconds
  let date_ob = new Date();

  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);
  
  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  
  // current year
  let year = date_ob.getFullYear();
  
  // current hours
  let hours = date_ob.getHours();
  
  // current minutes
  let minutes = date_ob.getMinutes();
  
  // current seconds
  let seconds = date_ob.getSeconds();

  var current_date = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
  return current_date;
}
// ---------- END Function currentDate ------------------


// user reset_Password http://localhost:3000/user/reser_password/[forgetPasswordToken]
// exports.reset_Password = (req, res) => {
// check if ForgetPassword Link is expired 
// if Expired return 404 status false Message "Your Link has been Expired"
// else return 200 status true "Please Generate New Password"


