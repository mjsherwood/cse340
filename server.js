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

app.get("/custom", function(req, res) {
  res.render("custom", {title: "Custom"})
})

app.get("/sedan", function(req, res) {
  res.render("sedan", {title: "Sedan"})
})

app.get("/suv", function(req, res) {
  res.render("suv", {title: "SUV"})
})

app.get("/truck", function(req, res) {
  res.render("truck", {title: "Truck"})
})

// Index route
app.get("/", function(req, res) {
  res.render("index", {title: "Home"})
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
