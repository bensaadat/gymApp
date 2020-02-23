const Gym = require("../models/gym.model");
const  multer = require('multer');
const fs = require('fs');

exports.getAllGymByUserId = (req, res) => {
   Gym.getAllGymByUserId(req.body.userid, (err, data) => {
       if (err)
         res.status(500).send({
           message:
             err.message || "Some error occurred while retrieving customers."
         });
       else res.send(data);
       
    });
};
