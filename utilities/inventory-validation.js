const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}


/*  **********************************
 *  Add Inventory Data Validation Rules
 * ********************************* */
validate.addInventoryRules = () => {
    return [
      // make is required and must be string
      body("inv_make")
        .trim()
        .isLength({ min: 1, max:20 })
        .withMessage("Please provide a valid make."), // on error this message is sent.
  
      // model is required and must be a string
      body("inv_model")
        .trim()
        .isLength({ min: 2, max: 20 })
        .withMessage("Please provide a valid model"), // on error this message is sent.
  
      // valid year is required and must be a number
      body("inv_year")
        .trim()
        .toInt()
        .isInt({ min: 1900, max: 2300 })
        .withMessage("Please provide a valid year."),

      // valid description is required and must be a string
      body("inv_description")
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage("Please provide a valid description."),
  
      // image location is required and must be a string
      body("inv_image")
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage("Valid image location is required."),

      // image location is required and must be a string
      body("inv_thumbnail")
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage("Valid image location is required."),
      
      // valid price must be entered and must be a number
      body("inv_price")
        .trim()
        .isNumeric()
        .toFloat()
        .isFloat({ min: 0.01, max: 100000000 })
        .withMessage("Valid price must be entered."),

      // miles must be entered and it must be a number
      body("inv_miles")
        .trim()
        .toInt()
        .isInt({ min: 1000, max: 1000000 })
        .withMessage("Valid miles must be entered. It can only be digits with no commas."),

      // color must be entered and it must be a string
      body("inv_color")
        .trim()
        .isLength({ min: 1, max: 20 })
        .withMessage("Valid color must be entered."),

      // classification_name must be entered and it must be a string
      body("classification_id")
        .trim()
        .isNumeric()
        .custom(async value => {
          // Get classifications
          const classificationsResult = await invModel.getClassifications();
          const classifications = classificationsResult.rows;

          // Check if the submitted value exists in the classifications array
          if (!classifications.find(c => c.classification_id == value)) {
            throw new Error('Invalid Classification ID');
          }
          return true;
        })
        .withMessage("Valid Classification ID must be entered."),
    ]
  }

/* ******************************
* Check data and return errors or continue to inventory submission
* ***************************** */
validate.checkInvData = async (req, res, next) => {
  const { inv_make,
          inv_model, 
          inv_year, 
          inv_description, 
          inv_image, 
          inv_thumbnail, 
          inv_price, 
          inv_miles, 
          inv_color, 
          classification_id } = req.body;
  
  let classifications = await utilities.getClassTypes();
  let errors = validationResult(req);
  let errorsArray = [];
  if (!errors.isEmpty()) {
    errorsArray = errors.array();
  }

  if(errorsArray.length === 0) {
    next(); // If there are no errors, move to the next middleware.
  } else {
    // If there are errors, render the error page.
    let nav = await utilities.getNav();
    res.render("inventory/addinventory", {
      errors,
      title: "Add Inventory",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color, 
      classification_id,
      classifications
    });
  }
}

module.exports = validate

