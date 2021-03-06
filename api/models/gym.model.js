const sql = require("./db.js");
// constructor
const Gym = function(gym) {
  this.name = gym.name;
  this.id_user = gym.id_user,
  this.discription = gym.discription,
  this.address = gym.address,
  this.city = gym.city, 
  this.phone = gym.phone 
};

// get All Gym By UserId
Gym.getAllGymByUserId = (UserId, result) => {
    sql.query(
      `SELECT * FROM gym WHERE id_user = "${UserId}"`, (err, res) => {
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

  // get All Gym By UserId
Gym.getAllGym = (result) => {
  sql.query(
    `SELECT * FROM gym `, (err, res) => {
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

 // get All Gym By UserId
 Gym.createGym = (newGym, result) => {
  sql.query(`INSERT INTO gym (name, id_user, discription, address, city, phone) values 
  ("${newGym.name}", ${newGym.id_user}, "${newGym.discription}","${newGym.address}", "${newGym.city}","${newGym.phone}")`, 
  newGym, function (err, data) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
// found costomer
    else {
      result(null, newGym);
      return;
    }
  });
};


Gym.getGymByCoach = (user_id, result) => {
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


// get All Gym By UserId
Gym.updateGym = (req, result) => {
  sql.query(`UPDATE gym SET name= "${req.body.name}", discription= "${req.body.discription}", address = "${req.body.address}", city = "${req.body.city}" WHERE id = ${req.body.id}`, 
  function (err, data) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
// found costomer
    else {
      result(null, data);
      return;
    }
  });
};



module.exports = Gym;