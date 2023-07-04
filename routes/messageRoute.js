// Needed Resources
const express = require("express");
const router = new express.Router();
const Util = require('../utilities/');
const accountController = require('../controllers/accountController');
const messageController = require('../controllers/messageController');
const regValidate = require('../utilities/account-validation');

// Route to inbox
router.get('/inbox', 
    Util.checkJWTToken, 
    Util.checkLogin, 
    Util.handleErrors(messageController.buildInbox));

// Route to create a new message
router.get('/newmessage/:login_id',
    Util.checkLogin,
    Util.handleErrors(messageController.buildNewMessage));

// Route to post a new message
router.post('/newmessage/:login_id',
    Util.checkLogin,
    Util.handleErrors(messageController.createMessage));

// Route to view archived messages
router.get('/archivedmessages/:login_id',
    Util.checkLogin,
    Util.handleErrors(messageController.buildArchivedMessages));

// Route to read a specific message
router.get('/read/:message_id',
    Util.checkLogin,
    Util.handleErrors(messageController.buildReadMessage));

// Route to reply to a message
router.get('/reply/:message_id',
    Util.checkLogin,
    Util.handleErrors(messageController.buildReplyMessage));

// Route to mark a message as read
router.post('/read/:message_id',
    Util.checkLogin,
    Util.handleErrors(messageController.updateMessageToRead));

// Route to archive a message
router.post('/archive/:message_id',
    Util.checkLogin,
    Util.handleErrors(messageController.archiveMessage));

// Route to delete a message
router.post('/delete/:message_id',
    Util.checkLogin,
    Util.handleErrors(messageController.deleteMessage));

// Route to display the reply form
router.get('/reply/:message_id',
    Util.checkLogin,
    Util.handleErrors(messageController.buildReplyForm));

// Route to send the reply
router.post('/reply/:message_id', 
    Util.checkLogin, 
    Util.handleErrors(messageController.sendReply));


module.exports = router;