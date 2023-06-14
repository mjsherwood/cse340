/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const baseController = require("./controllers/base-controller.js")
const accountRoute = require("./routes/accountRoute");
const utilities = require('./utilities');
const errorController = require('./controllers/errorController')
const session = require("express-session")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const pool = require('./database/')


/* ************************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionID',
}))

app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

//Unit 5, Login activity
app.use(cookieParser())
//Unit 5, Login Process activity
app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"))

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", require("./routes/inventory-route"))


// Account routes
app.use("/account", require("./routes/accountRoute"))

/* ***********************
 * Error Routes
 * *********************** */
app.get('/trigger-error', (req, res, next) => {
  errorController.triggerError(req, res, next);
})

app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page."})
})

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 * *********************** */
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message
  } 
  else if (err.status == 500) {
    message = "Intentional 500 Error"
  } else {
    message = "Server Error"
  }

  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 * *********************** */
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
