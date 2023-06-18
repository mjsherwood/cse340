// Needed Resources
const express = require('express')
const router = new express.Router()
const Util = require('../utilities/')
const invController = require('../controllers/inv-controller')
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get('/type/:classificationID', 
    Util.handleErrors(invController.buildByClassificationID));
// Route to build vehicle details page
router.get('/detail/:id', 
    Util.handleErrors(invController.getVehicleById));
// Route to build Management Page
router.get('/',
    Util.checkAccountType,
    Util.handleErrors(invController.buildManagementView));
// Route to build add Inventory Page
router.get('/addinventory',
    Util.checkAccountType,
    Util.handleErrors(invController.buildAddInv));
// Route to add Classification POage
router.get('/addclassification',
    Util.checkAccountType,
    Util.handleErrors(invController.buildAddClassification));
// Route to Post New Inventory
router.post('/addinventory', 
    invValidate.addInventoryRules(), 
    invValidate.checkInvData,
    Util.checkAccountType, 
    Util.handleErrors(invController.inputInventory));
// Route to Post new Classifications
router.post('/addclassification', 
    invValidate.classificationRules(), 
    invValidate.checkClassData, 
    Util.checkAccountType,
    Util.handleErrors(invController.inputClassification));
// Route to get Inventory for the edit Inventory Page
router.get("/getInventory/:classification_id",
    Util.checkAccountType,
    Util.handleErrors(invController.getInventoryJSON));
// Route to Edit Inventory Page
router.get("/edit/:inv_id",
    Util.checkAccountType,
    Util.handleErrors(invController.editInventoryView));
// Route to Post Inventory Changes
router.post("/update/",
    invValidate.addInventoryRules(), 
    invValidate.checkUpdateData,
    Util.checkAccountType,  
    Util.handleErrors(invController.updateInventory))
// Route to Delete Inventory Page
router.get("/delete/:inv_id", 
    Util.checkAccountType, 
    Util.handleErrors(invController.deleteInventoryView));
// Route to Post Deletes
router.post("/delete/", 
    Util.checkAccountType,
    Util.handleErrors(invController.deleteItem,))


module.exports = router;