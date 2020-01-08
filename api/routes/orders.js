//-------------------------------- Declaration --------------------
const express = require('express');
const router = express.Router();
const Orders = require('../controllers/orders.controller');
//------------------------------------------------------------------


//------------------------ All Routes -------------------------------------------
router.post("/fetchOrders", Orders.FetchOrdes); //List all Orders
router.post("/orderDetail", Orders.OrderDetail); // get order details for order
router.post("/isPicked", Orders.isPicked); // check if is picked
router.post("/orderDetailByBarcode", Orders.OrderDetailByBarcode); // get order details for order By Barcode
router.post("/isPickedByBarcode", Orders.isPickedByBarcode); // check if is picked By Barcode
router.post("/changeStatus", Orders.changeStatus); // change statu of order
router.post("/fetechOrderComment", Orders.fetechOrderCommentByShipperId); // fetechOrderComment
router.post("/addComment", Orders.addComment); // fetechOrderComment
//-------------------------------------------------------------------------------

module.exports = router;