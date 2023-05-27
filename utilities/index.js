const invModel = require("../models/inventory-model")
const Util = {}

/* *************************
 * Constructs the nav HTML unordered list
 * ************************* */
Util.getNav = async function (req, res, next) {
    try {
      let data = await invModel.getClassifications();
      let list = '<button id="hamburgerBtn"><span>&#9776;</span><span>X</span></button>';
      list += '<ul id="primaryNav" class="primaryNav">';
      list += '<li><a href="/" title="Home page">Home</a></li>';
      data.rows.forEach((row) => {
          list += "<li>";
          list +=
              '<a href="/inv/type/' +
              row.classification_id +
              '" title="See our inventory of ' +
              row.classification_name +
              ' vehicles">' +
              row.classification_name +
              "</a>";
          list +- "</li>";
      });
      list += "</ul>";
      return list;
    } catch (error) {
      console.error("Error in getNav:", error);
      if (next) {
          next(error);
      }
    }
};


/* ****************************************
 * Build the classification view HTML
 * **************************************** */
Util.buildClassificationGrid = async function(data){
  try {
      let grid
      if(data && data.length > 0){
          grid = '<div class="vehicles-container">'
          grid += '<ul id="inv-display">'
          data.forEach(vehicle => {
              if(vehicle && vehicle.inv_id && vehicle.inv_make && vehicle.inv_model && vehicle.inv_thumbnail && vehicle.inv_price){
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
              } else {
                  throw new Error("Invalid vehicle data in buildClassificationGrid");
              }
          })
          grid += '</ul>'
      } else if (data && data.length === 0) {
          grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
      } else {
          throw new Error("Invalid data in buildClassificationGrid");
      }
      return grid
  } catch (error) {
      console.error(error);
      throw error;
  }
}

/* ****************************************
 * Build vehicle detail page HTML
 * **************************************** */
Util.buildVehicleHtml = async function(vehicle) {
  try {
      const { inv_make, inv_model, inv_year, inv_price, inv_miles, inv_image, inv_description, inv_color } = vehicle;
      
      if (!inv_make || !inv_model || !inv_year || !inv_price || !inv_miles || !inv_image || !inv_description || !inv_color) {
          throw new Error('Missing vehicle property');
      }

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
  } catch (error) {
      console.error('Error building vehicle HTML:', error.message);
      throw error; // re-throw the error so it can be handled further up the call stack
  }
};
  

/* ******************************
 * Middleware for Handling Errors
 * Wrap other functions in this for
 * General Error Handling
 * ****************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = {
    ...Util
};