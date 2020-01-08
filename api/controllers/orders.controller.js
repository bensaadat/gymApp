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
                      livre += deliveredOrders[i].amount_ordered
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
                          "livre": livre + " DH",
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
      message: "La commande a déjà été prise par un autre shipper veuillez choisir une autre commande à expédier",
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
  Orders.isPickedBybarcod( req.body.increment_id,  (data)  => {
    if(data){
    return res.status(404).json({
      status: false,
      message: "La commande a déjà été prise par un autre shipper veuillez choisir une autre commande à expédier",
    });
  }else{
    return res.status(200).json({
      status: true,
      message: "Not Picked",
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
