const sql = require("./db.js");
const bcrypt = require("bcryptjs");
const fs = require('fs');
// constructor
const User = function(user) {
    this.first_name = user.first_name  ;
    this.last_name = user.last_name;
    this.birthday = user.birthday;
    this.city = user.city;
    this.vehicle = user.vehicle;
    this.min_orders = user.min_ofindUserrders;
    this.about_us = user.about_us;
    this.phone = user.phone;
    this.email = user.email;
    this.password = user.password;
    this.cin = user.cin;
    this.deposit = user.deposit;
    this.bank_account_title = user.bank_account_title;
    this.bank_account_number = user.bank_account_number;
    this.bank_name = user.bank_name;


  };
// funtion register user
  User.create = (newUser, result) => {
    //-var sql = "INSERT INTO users (ville, vehicule) VALUES ('Company Inc', 'Highway 37')";
    sql.query(`INSERT INTO users 
    (ville, vehicule, start_cmds, first_name, last_name, email, etendu_sur,
      phone, birthday, password, cin, garantie,bank_account_title, bank_account_number,bank_name) 
    VALUES (
      '${newUser.city}',
      '${newUser.vehicle}',
      '${newUser.min_orders}',
      '${newUser.first_name}',
      '${newUser.last_name}',
      '${newUser.email}',
      '${newUser.about_us}',
      '${newUser.phone}',
      '${newUser.birthday}',
      '${newUser.password}',
      '${newUser.cin}',
      '${newUser.deposit}',
      '${newUser.bank_account_title}',
      '${newUser.bank_account_number}',
      '${newUser.bank_name}'
      )`, newUser, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created user: ", { id: res.insertId, ...newUser });
      result(null, { id: res.insertId, ...newUser });
    });
  };
  
  // find user by Token
  User.findUserByToken = (forgetPasswordToken, result) => {
    sql.query(
      `SELECT * FROM users WHERE 
      forgetPasswordToken = "${forgetPasswordToken}"`, 
      
      (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found customer: ", true);
        result(null, res[0]);
        return;
      }
  
      // not found Customer with the id
      result({ kind: "not_found" }, null);
    });
  };

    // find user by Username
    User.findUser = (Username, result) => {
      sql.query(
        `SELECT * FROM users u,
        model_has_roles r WHERE u.id= r.model_id
        AND 
        cin = "${Username}"
        OR
        email = "${Username}"
        OR
        phone = "${Username}"
        OR
        username = "${Username}"
        `, 
        
        (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
    
        if (res.length) {
          console.log("found customer: ", true);
          result(null, res[0]);
          return;
        }
    
        // not found Customer with the id
        result({ kind: "not_found" }, null);
      });
    };

  // Chek if exist CIN
  User.checkCin = (cin, result) => {
    console.log(cin);
    sql.query(`SELECT * FROM users WHERE cin = "${cin}"`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log(res);
  // found costomer
      if (res.length) {
        result(null, res[0]);
        return;
      }
  
      // not found Customer with the id
      result(null, false);
    });
  };


  
  // Update Password
  User.updatePassword = (hashPssword, login, result) => {
    sql.query(`UPDATE users SET password="${hashPssword}" WHERE  
    cin = "${login}"
    OR
    email = "${login}"
    OR
    phone = "${login}"
    OR
    username = "${login}"`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
     
      result(null, true);
      return;
    });
  };

  User.imagePath = function(baseUrl, cin, imageType) {
    let imagePath = "./public/uploads/"+cin+"/"+imageType+"-"+cin+".jpg";
    if (fs.existsSync(imagePath)) {
      return baseUrl +  "/uploads/"+cin+"/"+imageType+"-"+cin+".jpg";
    }
    return null;
  }

  // userObject function

    User.userObject = function(id_user, data) {

      sql.query(`SELECT * FROM model_has_roles WHERE model_id = "${id_user}"`, (err, res) => {
        if (err) {
          data(err);
          return;
        }


    // found costomer
    console.log(res)
        if (res.length) {
          return res;
        }
        // not found Customer with the id
        data(null);
        return;  
      });
    };
 
  // Chek availability
  User.availability = (cin, result) => {
    sql.query(
      `SELECT disponibilite FROM users WHERE cin = "${cin}"`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  // found costomer
      if (res.length) {
        result(null, res[0]['disponibilite']);
        return;
      }
      // not found user with the id
      result(null, false);
    });
  };

  // Chek if exist Phone
  User.checkPhnoe = (phone, result) => {
    sql.query(
      `SELECT * FROM users WHERE phone = "${phone}"`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  // found costomer
      if (res.length) {
        result(null, res[0]);
        return;
      }
  
      // not found user with the id
      result(null, false);
    });
  };


   // Chek if exist Email
   User.checkEmail = (email, result) => {
    sql.query(
      `SELECT * FROM users WHERE email = "${email}"`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  // found costomer
      if (res.length) {
        result(null, res[0]);
        return;
      }
  
      // not found user with the id
      result(null, false);
    });
  };

  // get all users
  User.getAll = result => {
    sql.query("SELECT * FROM users", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("customers: ", res);
      result(null, res);
    });
  };
 

   // save availability
   User.saveAvailability =  ( cin, availability , result) => {
    sql.query(`UPDATE users SET disponibilite="${availability}"
              where cin =  "${cin}"`, (err) => {
      if (err) {
        console.log("error: ", err);
        result( err);
        return;
      }else{
        result(true);
        return;
      }
     
    });

   };

    // Chek if exist Email
    User.updateTokenAndDatime = (forgetPasswordToken, forgetPasswordDateTime, cin , result) => {
      sql.query(
        `UPDATE users SET forgetPasswordToken="${forgetPasswordToken}", forgetPasswordDateTime = "${forgetPasswordDateTime}" 
        where cin =  "${cin}"`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
    // found costomer
        if (result.length) {
          result(null, result[0]);
          return;
        }
        // not found user with the id
        result(null, false);
      });
    };

    User.usersCreatedBy = (user_id, result) => {
      sql.query(
        `SELECT * FROM users where users.creted_by =  ${user_id} and users.id != ${user_id} `, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
    // found costomer
        if (res.length) {
          result(null, res);
          return;
        }
    
        // not found user with the id
        result(null, false);
      });
    };

    User.getAllCoachByGym = (id_gym, result) => {
      sql.query(
        `SELECT * FROM users  
        JOIN coach on coach.user_id = users.id
        where coach.gym_id =  ${id_gym} `, (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
    // found costomer
        if (res.length) {
          result(null, res);
          return;
        }
    
        // not found user with the id
        result(null, false);
      });
    };

    User.getGymByCoach = (user_id, result) => {
      sql.query(
        `SELECT * FROM gym where id_user =  ${user_id} `, (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
    // found costomer
        if (res.length) {
          result(null, res);
          return;
        }
    
        // not found user with the id
        result(null, false);
      });
    };

    User.deleteUser = (user_id, result) => {
      sql.query(
        `DELETE  FROM users where id =  ${user_id} `, (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
    // found costomer
        if (res.length) {
          result(null, res);
          return;
        }
    
        // not found user with the id
        result(null, false);
      });
    };

    User.approveUser = (user_id, result) => {
      sql.query(
        `UPDATE users
        SET statut = 'active'
       where id =  ${user_id} `, (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
    // found costomer
        if (res.length) {
          result(null, res);
          return;
        }
    
        // not found user with the id
        result(null, false);
      });
    };

  

module.exports = User;
