const utilities = require("../utilities/")
const base_controller = {}

base_controller.buildHome = async function(req, res){
    const nav = await utilities.getNav()
    res.render("index", {title:  "Home", nav})
}

module.exports = base_controller