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



module.exports = Gym;