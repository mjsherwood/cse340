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
            errors: null
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
            errors: null
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
    let classificationSelect = await Util.buildClassificationList()
    res.render("inventory/addinventory", {
        title: "Add New Inventory",
        nav,
        classificationSelect,
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
        classificationSelect,
        errors: null
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
    let classificationSelect = await Util.buildClassificationList()
    req.flash(
      "notice",
      `Congratulations, you\'ve made a new ${inv_make} ${inv_model}.`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      errors: null
    })
  } else {
    let classificationSelect = await Util.buildClassificationList()
    req.flash("notice", "Sorry, the new car creation failed.")
    res.status(501).render("inventory/add-Inventory", {
      title: "Add New Inventory",
      nav,
      classificationSelect,
      errors: null
    })
  }
}


/* ************************************
 * Update Inventory
 * Unit 05 - Update an Inventory Item - Step 2
 * ************************************/
invCont.updateInventory = async function (req, res, next) {
  let nav = await Util.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await Util.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
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
    })
  }
}


/* ************************************
 * Input Classification
 * ************************************/
invCont.inputClassification = async (req, res) => {
    console.log("Is inputclass working?")
    const { classification_name } = req.body
    let classificationSelect = await Util.buildClassificationList()
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
                classificationSelect,
                errors: null
            })
    } else {
        req.flash("notice", "Sorry, submission failed. Please Try Again.")
        res.status(501).render("inventory/addclassification", {
            title: "Add Classification",
            nav,
            classificationSelect,
            errors: null
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
 * Build Edit Inventory View
 * Week 5 - Update Step 1 Activity
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await Util.getNav()
    const itemData = await invModel.getVehicleById(inv_id)
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

/* ***************************
 * Build Delete Inventory View
 * Week 5 - Delete an Inventory Item
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await Util.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/deleteconfirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price
  })
}


/* ***************************
 * Delete Inventory Item
 * Week 5 - Delete an Inventory Item
 * ************************** */
invCont.deleteItem = async function (req, res, next) {
  let nav = await Util.getNav()
  const inv_id = parseInt(req.body.inv_id)

  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult) {
    req.flash("notice", 'The deletion was successful.')
    res.redirect('/inv/')
  } else {
    req.flash("notice", 'Sorry, the delete failed.')
    res.redirect("/inv/delete/inv_id")
  }
}


module.exports = invCont;

