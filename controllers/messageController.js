const messageModel = require('../models/message-model');
const accountModel = require('../models/account-model');
const Util = require('../utilities');

/* ************************************
 * Deliver Inbox View
 * ************************************/
async function buildInbox(req, res, next) {
    console.log("Building inbox...");
    try {
        const login_id = res.locals.accountData.account_id;
        let nav = await Util.getNav();
        let accountData = await Util.getAccountData(login_id);
        let messageResult = await messageModel.getMessagesByUser(login_id);
        let archivedMessageResult = await messageModel.getArchivedMessages(login_id);
        let archivedMessages = archivedMessageResult; 
        let messageData = Array.isArray(messageResult) ? messageResult : [];

        for(let message of messageData) {
            message.message_created = new Date(message.message_created).toLocaleString();
        }

        let unreadMessageCount = messageData.filter(message => !message.message_read).length;
        res.render('./messaging/inbox', {
            title: `${accountData.account_firstname} Client Inbox`,
            nav,
            errors: null,
            accountData,
            messageData,
            unreadMessageCount,
            archivedMessages
        });
    } catch(err) {
        console.error(err);
        next(err);
    }
}


/* ************************************
 * Build New Message Creation View
 * ************************************/
async function buildNewMessage(req, res, next) {
    try {
        const login_id = req.params.login_id;
        let nav = await Util.getNav();
        let accountData = await Util.getAccountData(login_id);
        let recipients = await accountModel.getAllAccounts();

        res.render('messaging/newmessage', {
            title: 'Create New Message',
            nav,
            accountData,
            recipients
        });

    } catch(err) {
        console.error(err);
        next(err);
    }
}

/* ************************************
 * Create a new message
 * ************************************/
async function createMessage(req, res, next) {
    let login_id = req.params.login_id;
    try {
        const messageData = req.body;
        let message_subject = messageData.subject;
        let message_body = messageData.message_body;
        let message_to = messageData.to;
        let message_from = login_id;
        await messageModel.createMessage(message_subject, message_body, message_from, message_to);
        res.redirect(`/inbox/${login_id}`);
    } catch (err) {
        next(err);
    }
}

/* ************************************
 * Build the archived messages view
 * ************************************/
async function buildArchivedMessages(req, res, next) {
    try {
        const login_id = req.params.login_id;
        let nav = await Util.getNav();
        let accountData = await Util.getAccountData(login_id);
        let archivedMessages = await messageModel.getArchivedMessages(login_id);
        for(let message of archivedMessages) {
            message.message_created = new Date(message.message_created).toLocaleString();
        }

        res.render('./messaging/archivedmessages', {
            title: `${accountData.account_firstname}'s Archived Messages`,
            archivedMessages,
            accountData,
            nav,
            errors: null,
        });
    } catch(err) {
        console.error(err);
        next(err);
    }  
}

/* ************************************
 * Build the read message view
 * ************************************/
async function buildReadMessage(req, res, next) {
    console.log("Building read message");
    try {
        const message_id = req.params.message_id;
        console.log("Message ID:", message_id);
        let nav = await Util.getNav();
        let messageData = await messageModel.getMessage(message_id);

        console.log(messageData);

        let senderName = messageData.first_name + ' ' + messageData.last_name;  
        res.render('./messaging/read', {
            title: messageData.message_subject,
            nav,
            messageData,
            senderName,
            errors: null
        });
    } catch (error) {
        console.error(error);
        console.log("An error occurred while building the read message view");
        next(error);
    }
}

/* ************************************
 * Build the reply message view
 * ************************************/
async function buildReplyMessage(req, res, next) {
    const message_id = req.params.message_id;
    let nav = await Util.getNav();
    let messageData = await messageModel.getMessage(message_id);
    res.render('./messaging/reply', {
        title: "Reply to: " + messageData.account_firstname + " " + messageData.account_lastname,
        nav,
        messageData,
        errors: null
    });
}

/* ************************************
 * Update message to read
 * ************************************/
async function updateMessageToRead(req, res, next) {
    let login_id = res.locals.account_id;
    const message_id = req.params.message_id;
    await messageModel.updateMessageToRead(message_id);
    return res.redirect(`/inbox`);
}

/* ************************************
 * Archive a message
 * ************************************/
async function archiveMessage(req, res, next) {
    let login_id = res.locals.account_id;
    const message_id = req.params.message_id;
    await messageModel.archiveMessage(message_id);
    return res.redirect(`/inbox`);
}

/* ************************************
 * Delete a message
 * ************************************/
async function deleteMessage(req, res, next) {
    let login_id = res.locals.account_id;
    const message_id = req.params.message_id;
    await messageModel.deleteMessage(message_id);
    return res.redirect(`/inbox`);
}


/* ************************************
 * Send the reply message
 * ************************************/
async function sendReply(req, res, next) {
    try {
        const { message_subject, message_body, message_from, message_to, message_id } = req.body;

        // get the original message content
        const originalMessage = await messageModel.getMessage(message_id);

        // concatenate original message and the reply message
        const formattedMessageBody = 'Original Message:\r\n\r\n' + originalMessage.message_body + '\r\n\r\nReply:\r\n\r\n' + message_body;

        // create the reply message
        await messageModel.createMessage(`Re: ${message_subject}`, formattedMessageBody, message_from, message_to);
        res.redirect(`/inbox/`);
    } catch (err) {
        next(err);
    }
}

/* ************************************
 * Get message to Read
 * ************************************/
async function getMessageById(req, res, next) {
    try {
        const message_id = req.params.message_id;
        console.log("Message ID: " + message_id);
        let messageData = (await messageModel.getMessageById(message_id)).rows[0];
        console.log("Message Data: ", messageData);

        let senderName = messageData.first_name + ' ' + messageData.last_name;
        console.log("Sender Name: ", senderName);
        if (!messageData || !messageData.message_subject) {
            return res.redirect('/');
        }
        res.render('read', {
            title: `Reading message: ${messageData.message_subject}`,
            senderName,
            messageData
        });
    } catch(err) {
        console.error(err);
        next(err);
    }
}


module.exports = {
    buildInbox,
    buildNewMessage,
    createMessage,
    buildArchivedMessages,
    buildReadMessage,
    buildReplyMessage,
    updateMessageToRead,
    archiveMessage,
    deleteMessage,
    sendReply,
    getMessageById
}