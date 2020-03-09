const Members = require("../models/members.model");


           // user creted by ---------------------------------------------------------------------------------------
           exports.getAllMembersById_gym = (req, res) => {

            // check availability 
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
