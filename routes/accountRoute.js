// Needed Resources
const express = require("express")
const router = new express.Router()
const Util = require('../utilities/')
const accountController = require('../controllers/accountController')
const regValidate = require('../utilities/account-validation')

//Routes
router.get('/login', Util.handleErrors(accountController.buildLogin));
router.get('/register', Util.handleErrors(accountController.buildRegistration));
router.post('/register', 
    regValidate.registrationRules(), 
    regValidate.checkRegData, 
    Util.handleErrors(accountController.registerAccount));

// Process the login attempt
router.post(
    '/login',
    regValidate.loginRules(),
    regValidate.checkLoginData,
    Util.handleErrors(accountController.accountLogin)
)

router.get(
    '/',
    Util.checkLogin, 
    Util.handleErrors(accountController.buildAccount)
);

//Logout route - Week 5 Assignment
router.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/account/login');
});

//Account route - Week 5 Assignment
router.get('/account', Util.checkLogin, async (req, res, next) => {
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
});


module.exports = router;