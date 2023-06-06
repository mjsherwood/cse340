const invModel = require("../models/inventory-model")
const Util = require("../utilities/index")
const invCont = {}

/* ***************************
 * Build vehicles by classification view
 * *************************** */
invCont.buildByClassificationID = async function (req, res, next) {
    const classification_id = req.params.classificationID;
    console.log("Requested classification_id: ", classification_id);
    
    const data = await invModel.getVehiclesByClassificationID(classification_id);
    console.log("Data: ", data);
    
    if (data && data.length > 0) {
        const grid = await Util.buildClassificationGrid(data);
        let nav = await Util.getNav();
        const className = data[0].classification_name;
        res.render("inventory/classification", {
            title: className + " vehicles",
            nav,
            grid,
        });
    } else {
        console.error('No data found for the given classification_id');
    }
}

invCont.getVehicleById = async (req, res, next) => {
    try {
        const inv_id = req.params.id;
        console.log('inv_id:', inv_id);
        const vehicle = await invModel.getVehicleById(inv_id);
        const vehicleHtml = await Util.buildVehicleHtml(vehicle);
        let nav = await Util.getNav();  
        res.render('inventory/vehicle', {
            title: `${vehicle.inv_make} ${vehicle.inv_model}`,
            vehicleHtml,
            nav,
        });
    } catch (err) {
        next(err);
    }
}

/* ************************************
 * Deliver Inventory Add View
 * ************************************/
invCont.buildAddInv = async (req, res, next) => {
    let nav = await Util.getNav();  
    res.render('inventory/addinventory', {
        title: "Add Inventory",
        nav,
    });
}

/* ************************************
 * Deliver Management View
 * ************************************/
invCont.buildManagement = async (req, res, next) => {
    let nav = await Util.getNav();  
    res.render('inventory/management', {
        title: "Management",
        nav,
    });
}

/* ************************************
 * Deliver Classification Add View
 * ************************************/
invCont.buildAddClassification = async (req, res, next) => {
    let nav = await Util.getNav();  
    res.render('inventory/addclassification', {
        title: "Add Classification",
        nav,
    });
}


  
module.exports = invCont;

