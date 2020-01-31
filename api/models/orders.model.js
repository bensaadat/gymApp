const sql = require("./db.js");

const Orders = function() {
         
  };

        // check  autorized
        Orders.authorized = (cin, result) => {
        //console.log(check_autorized(cin));
        sql.query(`SELECT users.id as shipperId, CONCAT(bonus," DH") as bonus, users_groups.group_id 
        FROM users 
        JOIN users_groups on users_groups.user_id = users.id 
        WHERE cin = "${cin}" and active = 1`, (err, res) => {
                if (err) {
                  result(err, null);
                  return err;
                }
            // found costomer
                if (res.length) {
                  result(res[0]);
                  return;
                }
                // not found user with the id
                result(false);
          });   
        };

        // check Picked
        Orders.isPicked = (order_id, result) => {
          sql.query(`SELECT * FROM sales_flat_order
          WHERE statut_erp = 6 AND status = 'processing' 
          AND sales_flat_order.entity_id = "${order_id}"`, (err, res) => {
                 if (err) {
                   result(err, null);
                   return err;
                 }
             // found costomer
                 if (res.length) {
                   result(true);
                   return;
                 }
                 // not found user with the id
                 result(false);
           });   
         };

         // check isPickedBybarcod
         
        Orders.isPickedBybarcod = (increment_id,cin,current_date, result) => {
          sql.query(`SELECT * FROM sales_flat_order
          WHERE increment_id like ("${increment_id}%") and user_erp = 0`, (err, res) => {
                 if (err) {
                   result(err, null);
                   return err;
                 }
             // found costomer
		     console.log("Total Records:- " + res.length);

                 if (res.length) {
                   // sales_flat_order_status_history table
              sql.query(`INSERT INTO sales_flat_order_status_history 
              (parent_id, is_customer_notified, is_visible_on_front, comment, created_at, entity_name, id_user_erp) 
              VALUES (${res[0].entity_id}, 0, 0, 'La commande a été scannée', "${current_date}", 'Shipplo', (select id from users where cin = "${cin}"))`);
                   result(true);
                   return;
                 }
                 // not found user with the id
                 result(false);
           });   
         };

         Orders.isPickedBybarcodeByCIN = (increment_id,cin, result) => {
          sql.query(`SELECT * FROM sales_flat_order
		  LEFT JOIN users on users.id = user_erp
          WHERE sales_flat_order.increment_id like ("${increment_id}%") and users.cin = "${cin}"`, (err, res) => {
                 if (err) {
                   result(err, null);
                   return err;
                 }
             // found costomer
		     console.log("Total Records:- " + res.length);

                 if (res.length) {
                   result(true);
                   return;
                 }
                 // not found user with the id
                 result(false);
           });   
         };

        // calculate_gain
        Orders.calculate_gain = (city, group_id, result) => {
          // console.log(city);
          sql.query(`SELECT * FROM tarif_livraison WHERE nom_ville = "${city}" and groupe_ville = "${group_id}"`, 
          (err, res) => {
            //console.log(res);
                 if (err) {
                   result(err, null);
                   return err;
                 }
             // found costomer
                 if (res) {
                   result(res);
                   return;
                 }
                 // not found user with the id
                 result(false);
           });   
         };

         
         // count order Gaian
        Orders.gain = (shipperId, result) => {
        sql.query(`SELECT city, group_id  FROM sales_flat_order
          JOIN sales_flat_order_address ON sales_flat_order_address.parent_id = sales_flat_order.entity_id
          JOIN users_groups ON users_groups.user_id = sales_flat_order.user_erp
          WHERE statut_erp = 2 AND status = 'complete' 
          AND sales_flat_order.user_erp = "${shipperId}"
          AND sales_flat_order_address.address_type = 'shipping'`, 
          (err, res) => {

            sum = 0
              //  for (var i = 0; i < res.length; i++) {
              //     sql.query(`SELECT * FROM tarif_livraison WHERE nom_ville = "${res[i].city}" and groupe_ville = "${res[i].group_id}"`, 
              //         (error, res1) => {
              //           if(res1.length > 0){
              //             sum += res1[0].tarif; 
              //              // console.log(sum);     
              //             }else{
              //               sum += 50 ;
              //              // console.log(50);
              //               }
              //             });  
              //     }
              //     console.log(sum);
              if (res) {
                  //console.log(sum);
                      result(res);
                          return;
                }
           
           });   
         };



      // get all order list
      Orders.ListOrdes = (statut_erp, status, delivery_man, result) => {
        //console.log(delivered(1,2));
       collect =  sql.query(`SELECT sales_flat_order.entity_id, 
       sales_flat_order_address.firstname,
        sales_flat_order_address.firstname, 
        sales_flat_order_address.lastname, 
        sales_flat_order_address.city, 
        sales_flat_order_payment.method, 
        sales_flat_order_address.street, 
        sales_flat_order_address.telephone, 
        sales_flat_order_payment.amount_ordered, 
        sales_flat_order.weight, 
        sales_flat_order.commentaire, 
        sales_flat_shipment_track.track_number,
        sales_flat_order_address.latitude,
        sales_flat_order_address.longitude,
        sales_flat_order.date_statut_erp
        FROM sales_flat_order  
        JOIN sales_flat_order_address 
        ON sales_flat_order_address.parent_id = sales_flat_order.entity_id 
        JOIN sales_flat_shipment_track ON sales_flat_shipment_track.order_id = sales_flat_order.entity_id 
        JOIN sales_flat_order_payment ON sales_flat_order_payment.parent_id = sales_flat_order.entity_id
        WHERE sales_flat_order_address.address_type = "shipping" 
        AND sales_flat_order.status IN(${status})
        AND statut_erp IN(${statut_erp}) 
        AND sales_flat_order.user_erp = ${delivery_man} `, (err, res) => {
               if (err) {
                 result(err, null);
                 return err;
               }
           // if ound orders
               if (res.length) {
                const object = {...res,  nbr_orders: res.length }
                //console.log(res);
                 result(res, res.length);
                 return;
               }
               // not found user with the id
               result(null, 0);
         });   
       };

       Orders.getTotalOrdersCount = (statut_erp, status, delivery_man, result) => {
        collect =  sql.query(`SELECT count(*) AS totalCount
        FROM sales_flat_order  
        JOIN sales_flat_order_address 
        ON sales_flat_order_address.parent_id = sales_flat_order.entity_id 
        JOIN sales_flat_shipment_track ON sales_flat_shipment_track.order_id = sales_flat_order.entity_id 
        JOIN sales_flat_order_payment ON sales_flat_order_payment.parent_id = sales_flat_order.entity_id
        WHERE sales_flat_order_address.address_type = "shipping" 
        AND sales_flat_order.status IN(${status})
        AND statut_erp IN(${statut_erp}) 
        AND sales_flat_order.user_erp = ${delivery_man}`, (err, res) => {
               if (err) {
                 result(0);
                 return err;
               }
           // if found orders
               if (res.length) {
                  result(res[0].totalCount);
                  return;
               }
               // not found user with the id
               result(0);
         });   
      };

       Orders.getOrdersByPagging = (statut_erp, status, delivery_man, startLimit, endLimit, result) => {
        //console.log(delivered(1,2));
       collect =  sql.query(`SELECT sales_flat_order.entity_id, 
       sales_flat_order_address.firstname,
        sales_flat_order_address.firstname, 
        sales_flat_order_address.lastname, 
        sales_flat_order_address.city, 
        sales_flat_order_payment.method, 
        sales_flat_order_address.street, 
        sales_flat_order_address.telephone, 
        sales_flat_order_payment.amount_ordered, 
        sales_flat_order.weight, 
        sales_flat_order.commentaire, 
        sales_flat_shipment_track.track_number,
        sales_flat_order_address.latitude,
        sales_flat_order_address.longitude,
        sales_flat_order_address.location_type,
        sales_flat_order.date_statut_erp
        FROM sales_flat_order  
        JOIN sales_flat_order_address 
        ON sales_flat_order_address.parent_id = sales_flat_order.entity_id 
        JOIN sales_flat_shipment_track ON sales_flat_shipment_track.order_id = sales_flat_order.entity_id 
        JOIN sales_flat_order_payment ON sales_flat_order_payment.parent_id = sales_flat_order.entity_id
        WHERE sales_flat_order_address.address_type = "shipping" 
        AND sales_flat_order.status IN(${status})
        AND statut_erp IN(${statut_erp}) 
        AND sales_flat_order.user_erp = ${delivery_man}
        Limit ${startLimit},${endLimit}  `, (err, res) => {
               if (err) {
                 result(err, null);
                 return err;
               }
           // if ound orders
               if (res.length) {
                   result(res, res.length);
                 return;
               }
               // not found user with the id
               result(null, 0);
         });   
       };


       // get Single order 
      Orders.SingleOrdes = (order_id, result) => {
        //console.log(delivered(1,2));
          sql.query(`SELECT sales_flat_order.entity_id, 
            sales_flat_order_address.firstname,
              sales_flat_order_address.firstname, 
              sales_flat_order_address.lastname, 
              sales_flat_order_address.city, 
              sales_flat_order_payment.method, 
              sales_flat_order_address.street, 
              sales_flat_order_address.telephone, 
              sales_flat_order_payment.amount_ordered, 
              sales_flat_order.weight, 
              sales_flat_order.commentaire, 
              sales_flat_shipment_track.track_number,
              sales_flat_order_address.latitude,
              sales_flat_order_address.longitude,
              sales_flat_order_address.location_type,
              sales_flat_order.date_statut_erp 
              FROM sales_flat_order  
              JOIN sales_flat_order_address 
              ON sales_flat_order_address.parent_id = sales_flat_order.entity_id 
              JOIN sales_flat_shipment_track ON sales_flat_shipment_track.order_id = sales_flat_order.entity_id 
              JOIN sales_flat_order_payment ON sales_flat_order_payment.parent_id = sales_flat_order.entity_id
              WHERE sales_flat_order_address.address_type = "shipping" 
              AND sales_flat_order.entity_id = ${order_id} `, (err, res) => {
                    if (err) {
                      result(err, null);
                      return err;
                    }
                // if not found orders
                    if (res.length) {
                      //console.log(res);
                      result(res[0], res.length);
                      return;
                    }
                    // not found user with the id
                    result(false);
              });   
       };


              // get Single Ordes By barcode 
      Orders.SingleOrdesBybarcode = (increment_id, result) => {
        //console.log(delivered(1,2));
          sql.query(`SELECT IF(statut_erp=5 AND sales_flat_order.status = "processing", "collect", IF(statut_erp=6 AND sales_flat_order.status = "processing", "enLivraison", IF(statut_erp=2 AND sales_flat_order.status = "complete", "livre", IF(statut_erp=4 AND sales_flat_order.status = "tentative", "echec", IF(statut_erp=8 AND sales_flat_order.status = "erreur", "echec", "NAN"))))) as mode, sales_flat_order.entity_id, 
            sales_flat_order_address.firstname,
              sales_flat_order_address.firstname, 
              sales_flat_order_address.lastname, 
              sales_flat_order_address.city, 
              sales_flat_order_payment.method, 
              sales_flat_order_address.street, 
              sales_flat_order_address.telephone, 
              sales_flat_order_payment.amount_ordered, 
              sales_flat_order.weight, 
              sales_flat_order.commentaire, 
              sales_flat_shipment_track.track_number,
              sales_flat_order_address.latitude,
              sales_flat_order_address.longitude,
              sales_flat_order.date_statut_erp 
              FROM sales_flat_order  
              JOIN sales_flat_order_address 
              ON sales_flat_order_address.parent_id = sales_flat_order.entity_id 
              JOIN sales_flat_shipment_track ON sales_flat_shipment_track.order_id = sales_flat_order.entity_id 
              JOIN sales_flat_order_payment ON sales_flat_order_payment.parent_id = sales_flat_order.entity_id
              WHERE sales_flat_order_address.address_type = "shipping" 
              AND sales_flat_order.increment_id = ${increment_id} `, (err, res) => {
                    if (err) {
                      result(err, null);
                      return err;
                    }
                // if not found orders
                    if (res.length) {
                      //console.log(res);
                      result(res[0], res.length);
                      return;
                    }
                    // not found user with the id
                    result(false);
              });   
       };

       // get image path 
      imagePath = function(baseUrl, cin, imageType) {
        if(cin == "") {
          return "https://erp.goprot.com/assets/images/clients/";
        } else {
          return baseUrl +  "/uploads/"+cin+"/"+imageType+"-"+cin+".jpg";
        }
      }

       // get ftechOrderCommentByShipperId order 
      Orders.fetechOrderCommentByShipperId = (order_id, shipperId, basUrl, cin,result) => {
          sql.query(`SELECT sales_flat_order_status_history.parent_id, cin, sales_flat_order_status_history.comment, 
                  sales_flat_order_status_history.created_at, users.first_name,
                  users.image 
                  FROM sales_flat_order_status_history
                  JOIN users ON users.id = sales_flat_order_status_history.id_user_erp
                  WHERE parent_id = ${order_id}
                  AND id_user_erp IN(SELECT user_id FROM users_groups where group_id IN(1,2) or user_id = ${shipperId}) 
                  AND status IS NULL`, 
                  (err, res) => {
                    if (err) {
                      result(err, null);
                      return err;
                    }
                // if not found orders
                //console.log(res)
                    if (res.length) {


                      var all_data = [];
                      var avatarImage = {
                        avatarImage : imagePath(basUrl, cin, "AVATOR"),
                      }
                      object = { };
                      for (var i = 0; i < res.length; i++) {
                        if(res[i].cin == cin) {
                          res[i].image = imagePath(basUrl, cin, "AVATOR")
                        } else {
                          res[i].image = imagePath(basUrl, "", "AVATOR") + res[i].image
                        }
                      }
                      result(res, res.length);
                      return;
                    }
                    // not found user with the id
                    result(false);
              });   
       };
       
       

       // Function cahangeStatus 
      Orders.changeStatus = (order_id, statu, current_date, shipperId, result ) => {
            switch (statu) {
              case 'pick': // collected
              console.log('pick');
                // sales_flat_order table
                sql.query(`UPDATE sales_flat_order SET statut_erp = 6, status = 'processing', date_statut_erp =  "${current_date}", user_erp =  ${shipperId} WHERE entity_id =${order_id}`); 
                
                 // sales_flat_order_status_history table
                sql.query(`INSERT INTO sales_flat_order_status_history 
                        (parent_id, is_customer_notified, is_visible_on_front, status, comment, created_at, entity_name, id_user_erp) 
                        VALUES (${order_id}, 0, 0, 'Recuperer', 'Recuperer', "${current_date}", 'Shipplo', ${shipperId})`);
                result(true);
                return;
                break;

              case 'error':
                console.log('error');
                // sales_flat_order table
                sql.query(`UPDATE sales_flat_order SET statut_erp = 8, status = 'erreur', date_statut_erp =  "${current_date}", user_erp =  ${shipperId} WHERE entity_id =${order_id}`);
                
                 // sales_flat_order_grid table
                 sql.query(`UPDATE sales_flat_order_grid SET status = 'erreur' WHERE entity_id =${order_id}`);

                 // sales_flat_order_status_history table
                sql.query(`INSERT INTO sales_flat_order_status_history 
                        (parent_id, is_customer_notified, is_visible_on_front, status, comment, created_at, entity_name, id_user_erp) 
                        VALUES (${order_id}, 0, 0, 'erreur', 'erreur', "${current_date}", 'Shipplo', ${shipperId})`);
                result(true); 
                return;

                break;

                case 'tentative':
                  console.log('tentative');
                // sales_flat_order table
                sql.query(`UPDATE sales_flat_order SET statut_erp = 4, status = 'tentative', date_statut_erp =  "${current_date}", user_erp =  ${shipperId} WHERE entity_id =${order_id}`);
                
                 // sales_flat_order_grid table
                 sql.query(`UPDATE sales_flat_order_grid SET status = 'tentative' WHERE entity_id =${order_id}`);

                 // sales_flat_order_status_history table
                sql.query(`INSERT INTO sales_flat_order_status_history 
                        (parent_id, is_customer_notified, is_visible_on_front, status, comment, created_at, entity_name, id_user_erp) 
                        VALUES (${order_id}, 0, 0, 'Tentative', 'Tentative de livraison', "${current_date}", 'Shipplo', ${shipperId})`);
                result(true); 
                return;
                break;

              case 'delivered':
                console.log('delivered');
                // sales_flat_order table
                sql.query(`UPDATE sales_flat_order SET statut_erp = 2, status = 'complete',  state ='complete', date_statut_erp =  "${current_date}", user_erp =  ${shipperId} WHERE entity_id =${order_id}`);
                
                 // sales_flat_order_grid table
                 sql.query(`UPDATE sales_flat_order_grid SET status = 'complete' WHERE entity_id =${order_id}`);

                 // sales_flat_order_status_history table
                sql.query(`INSERT INTO sales_flat_order_status_history 
                        (parent_id, is_customer_notified, is_visible_on_front, status, comment, created_at, entity_name, id_user_erp) 
                        VALUES (${order_id}, 0, 0, 'livrer', 'complate', "${current_date}", 'Shipplo', ${shipperId})`);
                result(true); 
                return;
                break;

                case 'cancelDelivery':
                  console.log('delivered');
               // sales_flat_order table
               sql.query(`UPDATE sales_flat_order SET statut_erp = 6, status = 'processing',  state = 'processing', date_statut_erp =  "${current_date}" WHERE entity_id =${order_id}`);
                
               // sales_flat_order_grid table
               sql.query(`UPDATE sales_flat_order_grid SET status = 'processing' WHERE entity_id =${order_id}`);

               // sales_flat_order_status_history table
              sql.query(`INSERT INTO sales_flat_order_status_history 
                      (parent_id, is_customer_notified, is_visible_on_front, status, comment, created_at, entity_name, id_user_erp) 
                      VALUES (${order_id}, 0, 0, 'cancelDelivery', 'annuler la livraison', "${current_date}", 'Shipplo', ${shipperId})`);
              result(true); 
              return;
              break;


                case 'cancelReturn':
                // sales_flat_order table
sql.query(`UPDATE sales_flat_order SET statut_erp = 6, status = 'processing',  state = 'processing', date_statut_erp =  "${current_date}" WHERE entity_id =${order_id}`);
                
               // sales_flat_order_grid table
               sql.query(`UPDATE sales_flat_order_grid SET status = 'processing' WHERE entity_id =${order_id}`);

               // sales_flat_order_status_history table
              sql.query(`INSERT INTO sales_flat_order_status_history 
                      (parent_id, is_customer_notified, is_visible_on_front, status, comment, created_at, entity_name, id_user_erp) 
                      VALUES (${order_id}, 0, 0, 'cancelReturn', 'annuler la retour', "${current_date}", 'Shipplo', ${shipperId})`);
              result(true); 
              return;
              break;
              default:
                console.log('Sorry, we are out of ' + statu + '.');
            }
       };
   


       // Function cahangeStatus 
      Orders.addComment = (order_id, current_date, comment, shipperId, result ) => {
        // sales_flat_order_status_history table
        sql.query(`INSERT INTO sales_flat_order_status_history 
        (parent_id, is_customer_notified, is_visible_on_front, comment, created_at, entity_name, id_user_erp) 
        VALUES (${order_id}, 0, 0, "${comment}", "${current_date}", 'Shipplo', ${shipperId})`, (err, res) => {
          if (err) {
            result(err, null);
            return err;
          }

          result(true);
          return;
        });   
      };
      


      // Function addLocation 
      Orders.addLocation = (firstName, lastName, phone, adresse,latitude, longitude, result ) => {
        // sales_flat_order_status_history table
        sql.query(`INSERT INTO localisations
        (firstName, lastName, phone, adresse, latitude, longitude) 
        VALUES ("${firstName}", "${lastName}", "${phone}", "${adresse}", "${latitude}", "${longitude}")`, (err, res) => {
          if (err) {
          console.log(err)  
            result(err, null);
            return err;
          }
          
          
          result(true);
          return;
        });   
      };
      



    
   
module.exports = Orders;

  
