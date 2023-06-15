const invModel = require("../models/inventory-model")
const Util = require("../utilities/index")
const invCont = {}
const { invResult } = require('express-validator')

/* ***************************
 * Build vehicles by classification view
 * *************************** */
invCont.buildByClassificationID = async function (req, res, next) {
    const classification_id = req.params.classificationID;
    console.log("Requested classification_id: ", classification_id);
    
    const data = await invModel.getInventoryByClassificationID(classification_id);
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
    let classifications = await Util.buildClassificationList()
    res.render("inventory/addinventory", {
        title: "Add New Inventory",
        nav,
        classifications,
        errors: null
    })
}

/* ************************************
 * Deliver Management View
 * ************************************/
invCont.buildManagementView = async (req, res, next) => {
    let nav = await Util.getNav();
    const classificationSelect = await Util.buildClassificationList()  
    res.render('inventory/management', {
        title: "Vehicle Management",
        nav,
        classificationSelect
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
        errors: null
    });
}

/* ************************************
 * Input Inventory
 * ************************************/
invCont.inputInventory = async (req, res) => {
  let nav = await Util.getNav()
  const { 
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body
console.log(
  "form data: ",
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
)
  const invResult = await invModel.inputInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (invResult) {
    let nav = await  Util.getNav()

    req.flash(
      "notice",
      `Congratulations, you\'ve made a new ${inv_make} ${inv_model}.`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } else {
    let classifications = await Util.getClassTypes()
    req.flash("notice", "Sorry, the new car creation failed.")
    res.status(501).render("inventory/add-Inventory", {
      title: "Add New Inventory",
      nav,
      classifications,
      errors
    })
  }
}


/* ************************************
 * Input Classification
 * ************************************/
invCont.inputClassification = async (req, res) => {
    console.log("Is inputclass working?")
    const { classification_name } = req.body

    const classResult = await invModel.inputClassification(
        classification_name
    )
    let nav = await Util.getNav()
    if (classResult) {
        req.flash(
            "notice",
            `Congratulations, ${classification_name} Has been entered.`
            )
            res.status(201).render("inventory/management", {
                title: "Add Classification",
                nav,
                errors: null
            })
    } else {
        req.flash("notice", "Sorry, submission failed. Please Try Again.")
        res.status(501).render("inventory/addclassification", {
            title: "Add Classification",
            nav,
        })
    }
}

/* ***************************
 * Return Inventory by Classification As JSON
 * Week 5 - Select an Item from Inventory - Build A Controller Function
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationID(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  }

/* ***************************
 * Build Edit Item View
 * Week 5 - Update Step 1 Activity
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await Util.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    const classificationSelect = await Util.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/editInventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })
}

module.exports = invCont;

