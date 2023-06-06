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
    (req, res) => {
      res.status(200).send('login process')
    }
)


module.exports = router;