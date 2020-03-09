const sql = require("./db.js");

const Members = function(member) {
   
  };
  // get All Members By Id_gym
  Members.getAllMembersById_gym = (gymid, result) => {
      sql.query(
        `SELECT * FROM members WHERE id_Gym = "${gymid}"`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
    // found members
        if (res.length) {
          result(null, res);
          return;
        }
    
        // not found member with the id
        result(null, false);
      });
    };
    // get All Members
  Members.getAllMembers = (result) => {
    sql.query(
      `SELECT * FROM members `, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  // found members
      if (res.length) {
        result(null, res);
        return;
      }
  
      // not found member with the id
      result(null, false);
    });
  };


  
module.exports = Members;