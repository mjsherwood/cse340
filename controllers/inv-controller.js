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
    const classificationsResult = await invModel.getClassifications();
    const classifications = classificationsResult.rows;
    let nav = await Util.getNav();  
    res.render('inventory/addinventory', {
        title: "Add Inventory",
        nav,
        classifications: classifications
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

/* ************************************
 * Input Inventory
 * ************************************/
async function registerAccount(req, res) {
    let nav = await Util.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )
    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
            )
            res.status(201).render("account/login", {
                title: "Login",
                nav,
            })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}
module.exports = invCont;

