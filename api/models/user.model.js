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
    this.min_orders = user.min_orders;
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
// find user by Username
  User.findUser = (Username, result) => {
    sql.query(
      `SELECT ville, vehicule, start_cmds, first_name, last_name, 
        phone, birthday, password, cin, garantie,bank_account_title, bank_account_number, bank_name FROM users WHERE 
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

    User.userObject = function(basUrl, cin, data) {
      
      sql.query(`SELECT ville as city,vehicule as vehicle, start_cmds as  min_orders, first_name, last_name,  email, active,disponibilite,
      phone, birthday, cin, garantie as deposit,bank_account_title, bank_account_number, bank_name FROM users WHERE cin = "${cin}"`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          data(err);
          return;
        }


    // found costomer
        if (res.length) {
             
          const imageObject = {
            cinImage: this.imagePath(basUrl, cin, "CIN"),
            crImage : this.imagePath(basUrl, cin, "CR"),
            ribImage : this.imagePath(basUrl, cin, "RIB"),
            avatarImage : this.imagePath(basUrl, cin, "AVATOR"),
          }
          
          const object = {...res[0], ...imageObject }
          data(object);
          return;
        }
        // not found Customer with the id
        data(null);
        return;  
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

  

module.exports = User;
