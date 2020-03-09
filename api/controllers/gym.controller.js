const Gym = require("../models/gym.model");
const  multer = require('multer');
const fs = require('fs');

exports.getAllGymByUserId = (req, res) => {
   Gym.getAllGymByUserId(req.params.userid, (err, data) => {
       if (err)
         res.status(500).send({
           message:
             err.message || "Some error occurred while retrieving customers."
         });
       else res.send(data);
       
    });
};

exports.getAllGym = (req, res) => {
  Gym.getAllGym((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving customers."
        });
      else res.send(data);
      
   });
};

exports.createGym = (req, res) => {
  const gym = new Gym({
    name: req.body.name,
    id_user : req.body.id_user,
    discription : req.body.discription,
    address : req.body.address,
    city : req.body.city, 
    phone : req.body.phone  
});
  Gym.createGym(gym,(err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving customers."
        });
      else{
        res.status(200).send({
            data
        });
      } 
   });
};


exports.updateGym = (req, res) => {
  Gym.updateGym(req,(err, data) => {
    console.log(data);
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving customers."
        });
      else res.send(data);
      
   });
};


           // user creted by ---------------------------------------------------------------------------------------
           exports.getGymByCoach = (req, res) => {
            // check availability 
            Gym.getGymByCoach(req.params.user_id, (err, data) => {
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

