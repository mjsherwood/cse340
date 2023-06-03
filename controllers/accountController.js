const Util = require("../utilities/")

/* ************************************
 * Deliver Login View
 * ************************************/
async function buildLogin(req, res, next) {
    //const login_id = req.params.login_id;
    //console.log('login_id:', login_id);
    let nav = await Util.getNav();  
    res.render('./account/login', {
        title: "login",
        nav,
    });
  }

/* ************************************
 * Deliver Registration View
 * ************************************/
async function buildRegistration(req, res, next) {
    //const login_id = req.params.login_id;
    //console.log('login_id:', login_id);
    let nav = await Util.getNav();  
    res.render('./account/register', {
        title: "Register",
        nav,
        errors: null,
});
}

/* ************************************
 * Process Registration
 * ************************************/
async function registerAccount(req, res) {
    let nav = await Util.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
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
        })
    }
}

module.exports = { buildLogin, buildRegistration, registerAccount }