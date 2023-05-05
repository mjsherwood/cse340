const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

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
        const grid = await utilities.buildClassificationGrid(data);
        let nav = await utilities.getNav();
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

module.exports = invCont;