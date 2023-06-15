const Util = require("../utilities/")
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ************************************
 * Deliver Login View
 * ************************************/
async function buildLogin(req, res, next) {
    let nav = await Util.getNav();  
    res.render('account/login', {
        title: "login",
        nav,
        errors: null,
    });
}

/* ************************************
 * Deliver Registration View
 * ************************************/
async function buildRegistration(req, res, next) {
    let nav = await Util.getNav();  
    res.render('account/register', {
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

/* ****************************************
 *  Process login request
 *  Unit 5, Login Process activity
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await Util.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
     req.flash("notice", "Please check your credentials and try again.")
     res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
     })
    return
    }
    try {
     if (await bcrypt.compare(account_password, accountData.account_password)) {
     delete accountData.account_password
     const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     return res.redirect("/account/")
     }
    } catch (error) {
     return new Error('Access Forbidden')
    }
}

/* ************************************
 * Deliver Account View
 * ************************************/
async function buildAccount(req, res, next) {
    //const login_id = req.params.login_id;
    //console.log('login_id:', login_id);
    let nav = await Util.getNav();  
    res.render('./account/account', {
        title: "Account Management",
        nav,
        errors: null,
});
}

module.exports = { buildLogin, buildRegistration, registerAccount, accountLogin, buildAccount }