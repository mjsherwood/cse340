// Needed Resources
const express = require('express')
const router = new express.Router()
const Util = require('../utilities/')
const invController = require('../controllers/inv-controller')
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get('/type/:classificationID', Util.handleErrors(invController.buildByClassificationID));
// Route to build vehicle details page
router.get('/detail/:id', Util.handleErrors(invController.getVehicleById));
// Route to build Management Page
router.get('/', Util.handleErrors(invController.buildManagementView));
// Route to build add classification page
router.get('/addinventory', Util.handleErrors(invController.buildAddInv));
// Route to build add inventory page
router.get('/addclassification', Util.handleErrors(invController.buildAddClassification));

router.post('/addinventory', 
    //invValidate.addInventoryRules(), 
    //invValidate.checkInvData, 
    Util.handleErrors(invController.inputInventory));

router.post('/addclassification', 
    invValidate.classificationRules(), 
    invValidate.checkClassData, 
Util.handleErrors(invController.inputClassification));

router.get("/getInventory/:classification_id", Util.handleErrors(invController.getInventoryJSON));

//router.get("/inv/edit/:id", Util.handleErrors(invController.editInventoryView));

module.exports = router;