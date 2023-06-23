const Util = require("../utilities/")
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require('../database/index.js');
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
        account_email: '',
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
    const validPassword = await bcrypt.compare(account_password, accountData.account_password)
    if (!validPassword) {
        req.flash("notice", "Invalid password. Please try again.")
        res.status(401).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        return res.redirect("/account/")
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
}

/* ************************************
 * Deliver Account View
 * ************************************/
async function buildAccount(req, res, next) {
    const login_id = req.params.login_id;
    let nav = await Util.getNav();  
    res.render('./account/account', {
        title: "Account Management",
        nav,
        errors: null,
});
}

/* ************************************
 * Get Account Data
 * Week 5 - Assignment
 * ************************************/
async function getAccountData(id) {
    try {
        const result = await db.query("SELECT * FROM account WHERE account_id = $1", [id]);
        if(result.rows.length > 0) {
            return result.rows[0];
        } else {
            throw new Error("No account found with this id");
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};


/* ************************************
 * Get Account Data
 * Week 5 - Assignment
 * ************************************/
const buildAccountView = async (req, res, next) => {
    try {
        let nav = await Util.getNav();
        res.render('account', {
            title: 'Account',
            nav,
            accountData: res.locals.accountData
        });
    } catch (err) {
        next(err);
    }
};


/* ************************************
 * Get Account Data
 * Week 5 - Assignment
 * ************************************/
const buildUpdateAccountView = async (req, res, next) => {
    try {
        let nav = await Util.getNav();
        const accountData = await getAccountData(req.params.id);
        res.render('account/updateAccount', { title: 'Update Account', accountData, nav, error: null });
    } catch(err) {
        next(err);
    }
};


/* ************************************
 * Update Account Data
 * Week 5 - Assignment
 * ************************************/
const updateAccount = async function (req, res, next) {
    let nav = await Util.getNav()
    const {
        account_id,
        account_firstname,
        account_lastname,
        account_email
    } = req.body
    const updateResult = await accountModel.updateAccount(
        account_id,
        account_firstname,
        account_lastname,
        account_email
    )
  
    const errors = validationResult(req);

    if (updateResult && errors.isEmpty()) {
      const accountFirstName = updateResult.account_firstname
      req.flash("notice", `The account for ${accountFirstName} was successfully updated.`)
      res.redirect("/account/")
    } else {
      const accountName = `${account_firstname}`
      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render("account/updateAccount", {
      title: "Account Update for:" + accountName,
      nav,
      errors,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      })
    }
}
  

/* ************************************
 * Update Password
 * Week 5 - Assignment
 * ************************************/
const updatePassword = async function (req, res, next) {
    let nav = await Util.getNav()
    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(req.body.account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error changing the password.')
        return res.status(500).render("account/updateAccount", {
            title: "Account Update",
            nav,
            errors: null,
        })
    }

    const {
        account_id,
    } = req.body
    const updateResult = await accountModel.updatePassword(
        hashedPassword,
        account_id
    )
  
    if (updateResult) {
      req.flash("notice", `The password was successfully updated.`)
      res.redirect("/account/")
    } else {
      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render("account/updateAccount", {
      title: "Account Update",
      nav,
      errors: null,
      })
    }
}


module.exports = { 
    buildLogin, 
    buildRegistration, 
    registerAccount, 
    accountLogin, 
    buildAccount, 
    getAccountData, 
    buildAccountView, 
    buildUpdateAccountView,
    updateAccount,
    updatePassword
}