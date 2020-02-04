const sql = require("./db.js");

// constructor
const Customer = function(customer) {
 


  };



  



    // saveCustomerLocation
    Customer.saveCustomerLocation = (order_id , latitude, longitude) => {
       // sales_flat_order table
       //sql.query(`UPDATE sales_flat_order SET statut_erp = 6, status = 'processing', date_statut_erp =  "${current_date}", user_erp =  ${shipperId} WHERE entity_id =${order_id}`);
       
       // sales_flat_order_address table
       sql.query(`UPDATE sales_flat_order_address SET latitude = "${latitude}", longitude = "${longitude}"  WHERE parent_id = "${order_id}"`);
     
        return true;


    };



    
       // get Single order 
       Customer.checkOrderMode = (increment_id, result) => {
        //console.log(delivered(1,2));
          sql.query(`SELECT state, statut_erp, status FROM sales_flat_order  
          where increment_id = "${increment_id}"
          and statut_erp = 6
          `, (err, res) => {
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


  

module.exports = Customer;
