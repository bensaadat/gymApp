const express = require('express');
const router = express.Router();
const Gym = require("../controllers/gym.controller.js");


router.get("/getAllGymByUserId/:userid", Gym.getAllGymByUserId);


module.exports = router;