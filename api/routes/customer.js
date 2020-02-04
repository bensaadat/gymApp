//-------------------------------- Declaration --------------------
const express = require('express');
const router = express.Router();
const Customer = require('../controllers/customer.controller');
//------------------------------------------------------------------


//------------------------ All Routes -------------------------------------------
router.post("/checkOrderMode", Customer.checkOrderMode); //check Order Mode
router.post("/saveCustomerLocation", Customer.saveCustomerLocation); //List all Orders

//-------------------------------------------------------------------------------

module.exports = router;