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
    res.redirect('/');
});

//Account route - Week 5 Assignment
router.get('/account', 
    Util.checkLogin, 
    Util.handleErrors(accountController.buildAccountView));

//Account Update route - Week 5 Assignment
router.get('/update/:id', 
    Util.checkLogin, 
    Util.handleErrors(accountController.buildUpdateAccountView));

//Update account information - Week 5 Assignment
router.post('/update/', 
    Util.checkLogin, 
    regValidate.updateAccount, 
    Util.handleErrors(accountController.updateAccount));

//Update password - Week 5 Assignment
router.post('/update/password/', 
    Util.checkLogin, 
    regValidate.updatePassword(), 
    Util.handleErrors(accountController.updatePassword));


module.exports = router;