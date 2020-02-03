const Orders =  require('../models/orders.model'); // call model orders


// --------- Start Function FetchOrdes -----------------
exports.FetchOrdes = (req, res) => {
  // check if user autorized
  Orders.authorized( req.body.cin,  (data)  => {
        if(data == false){
          return res.status(404).json({
            status: false,
            message: "No Autorisation",
            data: []
          });
        }else{
          // call function list ordes
          Orders.ListOrdes(5, '"processing"', 0,(collectOrders, collectCount) => {
            Orders.ListOrdes(6, '"processing"', data.shipperId,(inDeliveryOrders, inDeliveryCount) => {
              Orders.ListOrdes(2, '"complete"', data.shipperId,(deliveredOrders, deliveredCount) => { 
                if(deliveredCount > 0){
                  gain = 0;
                  livre = 0;
                    for (var i = 0; i < deliveredOrders.length; i++) {
                      Orders.calculate_gain(deliveredOrders[i].city, data.group_id, (d1)  => {
                        if(d1.length > 0){
                          gain += d1[0].tarif;   
                        } else {
                          gain += 50 ;
                        }
                      });
                      if(deliveredOrders[i].method == "cashondelivery"){
                        livre += deliveredOrders[i].amount_ordered
                        
                      }
                      
                    }
                }else{
                  gain = 0;
                  livre = 0;
                }
                
                Orders.ListOrdes("4,8", '"tentative", "erreur"', data.shipperId,(returnedOrders, returnedCount) => {   
                      return res.status(200).json({
                        status: true,
                        message: "Success  Autorisation",
                        data : {
                          "livre": Number((livre).toFixed(1)) + " DH",
                          "gain" : gain +" DH",
                          "bonus": data.bonus,
                          "collect": {
                            "order_count": collectCount,
                            "orders" : collectOrders
                          },
                          "inDelivery": {
                            "order_count": inDeliveryCount,
                            "orders" : inDeliveryOrders
                          },
                          "delivered": {
                            "order_count": deliveredCount,
                            "orders" : deliveredOrders
                          },
                          "returned": {
                            "order_count": returnedCount,
                            "orders" : returnedOrders
                          }
                          }
                  });
              });
            });
          });
          });
        }
      });
};
// --------- End Function FetchOrdes -------------------

// --------- Start Function FetchOrdesByPagging -----------------
exports.FetchOrdersByPagging = (req, res) => {
  // check if user autorized
  Orders.authorized(req.body.cin,  (data)  => {
    if(data == false){
      return res.status(404).json({
        status: false,
        message: "No Autorisation",
        data: []
      });
    }else{
      // call function getOrdersByPagging
      let limit = 20;
      let offset = req.body.offset;
      Orders.ListOrdes(2, '"complete"', data.shipperId,(totalDeliveredOrders, totalDeliveredCount) => { 
        if(totalDeliveredCount > 0){
          gain = 0;
          livre = 0;
            for (var i = 0; i < totalDeliveredOrders.length; i++) {
              Orders.calculate_gain(totalDeliveredOrders[i].city, data.group_id, (d1)  => {
                if(d1.length > 0){
                  gain += d1[0].tarif;   
                } else {
                  gain += 50 ;
                }
              });
              if(totalDeliveredOrders[i].method == "cashondelivery"){
                livre += totalDeliveredOrders[i].amount_ordered
              }
            }
        }else{
          gain = 0;
          livre = 0;
        }
        switch (req.body.mode) {
          case 'collect': 
            Orders.getTotalOrdersCount(5, '"processing"', 0,(totalCollectOrdersCount) => {
              Orders.getOrdersByPagging(5, '"processing"', 0, offset, limit,(orders, ordersCount) => {
                Orders.getTotalOrdersCount(6, '"processing"', data.shipperId,(totalInDeliveryOrdersCount) => {
                  Orders.getTotalOrdersCount("4,8", '"tentative", "erreur"', data.shipperId,(totalErrorOrdersCount) => {
                    return res.status(200).json({
                      status: true,
                      message: "Success  Autorisation",
                      data : {
                        "livre": Number((livre).toFixed(1)) + " DH",
                        "gain" : gain +" DH",
                        "bonus": data.bonus,
                        "collectCount" : totalCollectOrdersCount,
                        "inDeliveryCount" : totalInDeliveryOrdersCount,
                        "deliveredCount" : totalDeliveredCount,
                        "errorCount" : totalErrorOrdersCount,
                        "ordersMode" : req.body.mode,
                        "ordersReturned" : ordersCount,
                        "orders" : orders
                      }
                    });
                  });
                });
              });
            });
          break;
          case 'inDelivery': 
            Orders.getTotalOrdersCount(6, '"processing"', data.shipperId,(totalInDeliveryOrdersCount) => {
              Orders.getOrdersByPagging(6, '"processing"', data.shipperId, offset, limit,(orders, ordersCount) => {
                Orders.getTotalOrdersCount(5, '"processing"', 0,(totalCollectOrdersCount) => {
                  Orders.getTotalOrdersCount("4,8", '"tentative", "erreur"', data.shipperId,(totalErrorOrdersCount) => {
                    return res.status(200).json({
                      status: true,
                      message: "Success  Autorisation",
                      data : {
                        "livre": Number((livre).toFixed(1)) + " DH",
                        "gain" : gain +" DH",
                        "bonus": data.bonus,
                        "collectCount" : totalCollectOrdersCount,
                        "inDeliveryCount" : totalInDeliveryOrdersCount,
                        "deliveredCount" : totalDeliveredCount,
                        "errorCount" : totalErrorOrdersCount,
                        "ordersMode" : req.body.mode,
                        "ordersReturned" : ordersCount,
                        "orders" : orders
                      }
                    });
                  });
                });
              });
            });
          break;
          case 'delivered': 
            Orders.getOrdersByPagging(2, '"complete"', data.shipperId, offset, limit,(orders, ordersCount) => {
              Orders.getTotalOrdersCount(5, '"processing"', 0,(totalCollectOrdersCount) => {
                Orders.getTotalOrdersCount(6, '"processing"', data.shipperId,(totalInDeliveryOrdersCount) => {
                  Orders.getTotalOrdersCount("4,8", '"tentative", "erreur"', data.shipperId,(totalErrorOrdersCount) => {
                    return res.status(200).json({
                      status: true,
                      message: "Success  Autorisation",
                      data : {
                        "livre": Number((livre).toFixed(1)) + " DH",
                        "gain" : gain +" DH",
                        "bonus": data.bonus,
                        "collectCount" : totalCollectOrdersCount,
                        "inDeliveryCount" : totalInDeliveryOrdersCount,
                        "deliveredCount" : totalDeliveredCount,
                        "errorCount" : totalErrorOrdersCount,
                        "ordersMode" : req.body.mode,
                        "ordersReturned" : ordersCount,
                        "orders" : orders
                      }
                    });
                  });
                });
              });
            });
          break;
          case 'error': 
            Orders.getTotalOrdersCount("4,8", '"tentative", "erreur"', data.shipperId,(totalErrorOrdersCount) => {
              Orders.getOrdersByPagging("4,8", '"tentative", "erreur"', data.shipperId, offset, limit,(orders, ordersCount) => {
                Orders.getTotalOrdersCount(5, '"processing"', 0,(totalCollectOrdersCount) => {
                  Orders.getTotalOrdersCount(6, '"processing"', data.shipperId,(totalInDeliveryOrdersCount) => {
                    return res.status(200).json({
                      status: true,
                      message: "Success  Autorisation",
                      data : {
                        "livre": Number((livre).toFixed(1)) + " DH",
                        "gain" : gain +" DH",
                        "bonus": data.bonus,
                        "collectCount" : totalCollectOrdersCount,
                        "inDeliveryCount" : totalInDeliveryOrdersCount,
                        "deliveredCount" : totalDeliveredCount,
                        "errorCount" : totalErrorOrdersCount,
                        "ordersMode" : req.body.mode,
                        "ordersReturned" : ordersCount,
                        "orders" : orders
                      }
                    });
                  });
                });
              });
            });
          break;
        }
      });
    }
  });
};
// --------- End Function FetchOrdesByPagging -------------------


// --------- Start Function OrderDetail ----------------
exports.OrderDetail = (req, res) => {
  // check if user autorized
  Orders.authorized( req.body.cin,  (data)  => {
    if(data){
      // call function list ordes
      Orders.SingleOrdes(req.body.order_id,(DataOrders, one) => {
          return res.status(200).json({
            status: true,
            message: "Success  Autorisation",
            data : DataOrders
          });
      });
    }else{
      return res.status(404).json({
        status: false,
        message: "No Autorisation",
        data: []
      });
    }
  });

  
};

// --------- Start Function OrderDetailBybarcode ----------------
exports.OrderDetailByBarcode = (req, res) => {
  // check if user autorized
  Orders.authorized( req.body.cin,  (data)  => {
    if(data){
      // call function list ordes
      Orders.SingleOrdesBybarcode(req.body.increment_id,(DataOrders, one) => {
          return res.status(200).json({
            status: true,
            message: "Success  Autorisation",
            data : DataOrders
          });
      });
    }else{
      return res.status(404).json({
        status: false,
        message: "No Autorisation",
        data: []
      });
    }
  });

  
};
// --------- End Function OrderDetail ------------------


// --------- Start Function isPicked -------------------
exports.isPicked = (req, res) => {
  Orders.isPicked( req.body.order_id,  (data)  => {
    if(data){
    return res.status(404).json({
      status: false,
      message: "Attention! cette commande ne vous est pas affectée",
    });
  }else{
    return res.status(200).json({
      status: true,
      message: "Not Picked",
    });
  }
});
}

// --------- Start Function isPicked -------------------
exports.isPickedByBarcode = (req, res) => {
  Orders.isPickedBybarcod( req.body.increment_id, req.body.cin,currentDate(),  (data)  => {
    if(data){
      return res.status(200).json({
        status: true,
        message: "Not Picked"
      });
  }else{
    Orders.isPickedBybarcodeByCIN(req.body.increment_id, req.body.cin, (data1) => {
      if(data1) {
        return res.status(200).json({
          status: true,
          message: "This is Your Order"
        });
      } else {
        return res.status(404).json({
          status: false,
          message: "Attention! cette commande ne vous est pas affectée"
        });
      }
    });
  }
});
}
// --------- End Function isPicked ---------------------


// --------- Start Function changeStatus --------------
exports.changeStatus = (req, res) => {

  Orders.authorized( req.body.cin,  (data)  => {
    if(data == false){
      return res.status(404).json({
        status: false,
        message: "No Autorisation",
        data: []
      });
    }else{
      Orders.changeStatus( req.body.order_id, req.body.status, currentDate(), data.shipperId, (data)  => {
        if(data){
        return res.status(200).json({
          status: true,
          message: "statu changed",
        });
      }else{
        return res.status(404).json({
          status: false,
          message: "Statu Not Changed",
        });
      }
    });

    }

    
  })
}
// --------- End Function currentDate ----------------

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

// --------- Start Function ftechOrderCommentByShipperId --------------
exports.fetechOrderCommentByShipperId = (req, res) => {
  Orders.authorized( req.body.cin,  (data)  => {
    if(data == false){
      return res.status(404).json({
        status: false,
        message: "No Autorisation",
        data: []
      });
    }else{
      basUrl =  req.protocol + '://' + req.headers.host ;
      Orders.fetechOrderCommentByShipperId( req.body.order_id, data.shipperId, basUrl, req.body.cin, (data)  => {
        //console.log(data)
        if(data){
        return res.status(200).json({
          status: true,
          message: "statu fffffff",
          data : data
        });
      }else{
        return res.status(404).json({
          status: false,
          message: "Statu Not Changed",
        });
      }
    });

    }

    
  })
}
// --------- End Function ftechOrderCommentByShipperId ----------------

// --------- Start Function ftechOrderCommentByShipperId --------------
exports.addComment = (req, res) => {
  Orders.authorized( req.body.cin,  (data)  => {
    if(data == false){
      return res.status(404).json({
        status: false,
        message: "No Autorisation",
        data: []
      });
    }else{
      Orders.addComment( req.body.order_id, currentDate(), req.body.comment, data.shipperId, (data)  => {
        //console.log(data)
        if(data){
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

    }

    
  })
}
// --------- End Function ftechOrderCommentByShipperId ----------------

// --------- Start Function ftechOrderCommentByShipperId --------------
exports.addLocation = (req, res) => {
  Orders.authorized( req.body.cin,  (data)  => {
    if(data == false){
      return res.status(404).json({
        status: false,
        message: "No Autorisation",
        data: []
      });
    }else{
      Orders.addLocation( req.body.firstName, req.body.lastName, req.body.phone, req.body.adresse, req.body.latitude, req.body.longitude,  (data)  => {
        //console.log(data)
        if(data){
        return res.status(200).json({
          status: true,
          message: "Location added",
        });
      }else{
        return res.status(404).json({
          status: false,
          message: "Error add Location",
        });
      }
    });

    }

    
  })
}
// --------- End Function ftechOrderCommentByShipperId ----------------

// --------- Start Function Request Customer GeoLocation --------------
  exports.requestCustomerLocation = (req, res) => {
            console.log(req.body.cin);

    Orders.authorized( req.body.cin,  (data)  => {
      if(data == false){
        return res.status(404).json({
        status: false,
        message: "No Autorisation",
        });
      }else{
        url = 'https://www.goprot.com/trackingNumber?=LY' + req.body.increment_id + 'MA';
        console.log(url);
        phone = user.replace_first_digit(req.body.phone);
                    console.log(req.body.phone);

        smsObject = {from: "Shipplo", to : phone, text : url}; // message sms
        user.sendSms(smsObject);
                            console.log(req.body.email);

        sendEmail(url, req.body.email);
                                              console.log(req.body.increment_id;

        Orders.SingleOrdesBybarcode(req.body.increment_id,(orderData, one) => {

          Orders.addComment( orderData.entity_id, currentDate(), "Shipper has requested Customer Geolocation", req.body.cin, (data)  => {
            if(data){
              return res.status(200).json({
              status: true,
              message: "Customer has been notified",
              });
            }else{
              return res.status(404).json({
              status: false,
              message: "Status Not Changed",
              });
            }
          });
        });
      }
    });
  }
// --------- End Function Request Customer GeoLocation ----------------


        // send email
          sendEmail = function(resetURL, to) {
          
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

      htmlBody = '<a href="'+resetURL+'">'+resetURL+'</a>';
  console.log(transporter);
          var mailOptions = {
            from: 'no-reply@goprot.com',
            to: to,
            subject: 'Help Shipplo Shipper to find your address',
            html: htmlBody
          };
      console.log(mailOptions);
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
        console.log('Email not sent');
               return false;
            } else {
              console.log('Email sent: ' + info.response);
              return false;
            }
          });
        };
