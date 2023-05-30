// Needed Resources
const express = require("express")
const router = new express.Router()
const Util = require('../utilities/index.js')
const invController = require('../controllers/inv-controller')

// Route to build inventory by classification view
router.get("/type/:classificationID", Util.handleErrors(invController.buildByClassificationID));
// Route to build vehicle details page
router.get('/detail/:id', Util.handleErrors(invController.getVehicleById));

module.exports = router;