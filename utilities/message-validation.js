const { body, validationResult } = require("express-validator");
const messageModel = require("../models/message-model");
const accountModel = require('../models/account-model');
const Util = require('../utilities');
const validate = {};

/*  **********************************
 *  Message Data Validation Rules
 * ********************************* */
validate.messageRules = () => {
    return [
      body("subject")
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage("Subject cannot be empty."),
      body("message_body")
        .trim()
        .isLength({ min: 1, max: 750 })
        .withMessage("Message cannot be empty."),
    ]
}

/* ******************************
* Check data and return errors or continue to sending message
* ***************************** */
validate.checkMessageData = async (req, res, next) => {
  const { subject, message_body } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await Util.getNav();
    let recipients = await accountModel.getAllAccounts();
    res.render("messaging/newmessage", {
      errors: errors.array(),
      title: "New Message",
      nav,
      subject,
      message_body,
      recipients,
    });
    return;
  }
  next();
}

module.exports = validate;