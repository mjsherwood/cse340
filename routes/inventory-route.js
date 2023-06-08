// Needed Resources
const express = require('express')
const router = new express.Router()
const Util = require('../utilities/index.js')
const invController = require('../controllers/inv-controller')

// Route to build inventory by classification view
router.get('/type/:classificationID', Util.handleErrors(invController.buildByClassificationID));
// Route to build vehicle details page
router.get('/detail/:id', Util.handleErrors(invController.getVehicleById));
// Route to build Management Page
router.get('/', Util.handleErrors(invController.buildManagement));
// Route to build add classification page
router.get('/addinventory', Util.handleErrors(invController.buildAddInv));
// Route to build add inventory page
router.get('/addclassification', Util.handleErrors(invController.buildAddClassification));


module.exports = router;