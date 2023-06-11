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
    let classifications = await Util.getClassTypes()
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
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    } = req.body
  
    const invResult = await invModel.inputInventory(
      
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

module.exports = invCont;

