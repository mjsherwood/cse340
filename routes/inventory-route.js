// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require('../controllers/inv-controller')

// Route to build inventory by classification view
router.get("/type/:classificationID", async (req, res, next) => {
    try {
        await invController.buildByClassificationID(req, res, next);
    } catch (error) {
        next(error);
    }
});

// Route to get a single vehicle's details
router.get('/detail/:id', async (req, res, next) => {
    try {
        await invController.getVehicleById(req, res, next);
    } catch (error) {
        console.error("Error in /detail/:id route:", error);
        next(error);
    }
});

module.exports = router;