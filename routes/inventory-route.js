// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require('../controllers/inv-controller')

// Route to build inventory by classification view
//router.get("/type/:classificationID", invController.buildByClassificationID);
router.get("/type/:classificationID", (req, res, next) => {
    console.log("Route classificationID:", req.params.classificationID);
    invController.buildByClassificationID(req, res, next);
});

router.get('/detail/:id', invController.getVehicleById);

module.exports = router;