const express = require('express');
const router = express.Router();
const Members = require("../controllers/members.controller.js");

// get All Memebers by gym
router.get("/getAllMembersById_gym/:gymid", Members.getAllMembersById_gym);




module.exports = router;