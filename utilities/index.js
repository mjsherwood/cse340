const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require('dotenv').config()

/* *************************
 * Constructs the nav HTML unordered list
 * ************************* */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log('Data:', data);
  if (!data) {
      console.log('No data returned from getClassifications.');
      return;
  }
  let list = '<button id="hamburgerBtn"><span>&#9776;</span><span>X</span></button>' 
  list += '<ul id="primaryNav" class="primaryNav">'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
      list += "<li>"
      list +=
          '<a href="/inv/type/' +
          row.classification_id +
          '" title="See our inventory of ' +
          row.classification_name +
          ' vehicles">' +
          row.classification_name +
          "</a>"
      list +- "</li>"
  })
  list += "</ul>"
  return list
}


/* ****************************************
 * Build the classification view HTML
 * **************************************** */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
        grid = '<div class="vehicles-container">'
        grid += '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li class="card">'
            grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id
            + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model
            + 'details"><img src="' + vehicle.inv_thumbnail
            +'" alt="Image of'+ vehicle.inv_make + ' ' + vehicle.inv_model
            +' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View '
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* ****************************************
 * Build vehicle pdp
 * **************************************** */
Util.buildVehicleHtml = async function(vehicle) {
    const { inv_make, inv_model, inv_year, inv_price, inv_miles, inv_image, inv_description, inv_color } = vehicle;
    const priceFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(inv_price);
    const mileageFormatted = new Intl.NumberFormat('en-US').format(inv_miles);
  
    return `
      <div class="vehicle">
        <div class="vehicle-image">
          <img src="${inv_image}" alt="${inv_make} ${inv_model}" />
        </div>
        <div class="vehicle-details">
          <h2>(${inv_year}) ${inv_make} ${inv_model}</h2>
          <p>Price: ${priceFormatted}</p>
          <p>Mileage: ${mileageFormatted}</p>
          <p>Color: ${inv_color}</p>
        </div>
        <div class="vehicle-description"> 
          <p>Description: ${inv_description}</p>
        </div>
      </div>
    `;
};


/* ************************
 * Constructs the dropdown HTML list
 ************************** */
Util.buildClassificationList = async function(){
  let data = await invModel.getClassifications()
  let classifications
  data.rows.forEach(classification => {
    classifications += "<option value=\"" + classification.classification_id + "\">" + classification.classification_name + "</option>"
  })
  return classifications
}


/* ******************************
 * Middleware for Handling Errors
 * Wrap other functions in this for
 * General Error Handling
 * ****************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
}

/* ****************************************
* Middleware to check token validity
* Unit 5 JWT Authorize activity
**************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
   next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}


module.exports = {
    ...Util,
};