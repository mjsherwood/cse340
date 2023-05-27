const utilities = require("../utilities/")
const base_controller = {}

base_controller.buildHome = async function(req, res){
    try {
        const nav = await utilities.getNav()
        res.render("index", {title:  "Home", nav})
    } catch (error) {
        next(error);
    }
}

module.exports = base_controller