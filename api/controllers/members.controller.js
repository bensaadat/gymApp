const Members = require("../models/members.model");


// user get All Members By Id_gym by ---------------------------------------------------------------------------------------
exports.getAllMembersById_gym = (req, res) => {
  Members.getAllMembersById_gym(req.params.gymid, (err, data) => {
    if (err) {
      return res.status(404).json({
      status: false,
      message: err
      });    
    } else {
      return res.status(200).json({
        status: true,
        data: data,
      });      
    }
  });
};
   
// user get All Members ---------------------------------------------------------------------------------------
exports.getAllMembers = (req, res) => {
  Members.getAllMembers((err, data) => {
    if (err) {
      return res.status(404).json({
        status: false,
        message: err
      });   
    } else {
      return res.status(200).json({
        status: true,
        data: data,
        });  
    }
  });
};

