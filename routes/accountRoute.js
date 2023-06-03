// Needed Resources
const express = require("express")
const router = new express.Router()
const Util = require('../utilities/')
const accountController = require('../controllers/accountController')

//Routes
router.get('/login', Util.handleErrors(accountController.buildLogin));
router.get('/register', Util.handleErrors(accountController.buildRegistration));


module.exports = router;