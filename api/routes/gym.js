const express = require('express');
const router = express.Router();
const Gym = require("../controllers/gym.controller.js");

// get All Gym by ID USER
router.get("/getAllGymByUserId/:userid", Gym.getAllGymByUserId);

// get All Gym
router.get("/getAllGym", Gym.getAllGym);

// create Gym
router.post("/createGym", Gym.createGym);


module.exports = router;