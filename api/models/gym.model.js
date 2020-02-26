const sql = require("./db.js");
// constructor
const Gym = function() {
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
 Gym.createGym = (req, result) => {
  sql.query(`INSERT INTO gym (name, id_user, discription, address, city, phone) values 
  ("${req.body.name}", ${req.body.id_user}, "${req.body.discription}","${req.body.address}", "${req.body.city}","${req.body.phone}")`, 
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