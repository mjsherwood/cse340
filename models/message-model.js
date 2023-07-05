const pool = require("../database")

/* ************************************
 * Store new message
 * ************************************/
async function createMessage(message_subject, message_body, message_from, message_to){
    try {
        const sql = "INSERT INTO messages (message_subject, message_body, message_from, message_to, message_created, message_read, message_archived) VALUES ($1, $2, $3, $4, NOW(), false, false) RETURNING *"
        return await pool.query(sql, [message_subject, message_body, message_from, message_to])
    } catch (error) {
        return error.message
    }
}

/* ************************************
 * Retrieve messages by user ID
 * ************************************/
async function getMessagesByUser(user_id){
    try {
        const sql = "SELECT messages.*, account.account_firstname, account.account_lastname FROM messages INNER JOIN account ON messages.message_from = account.account_id WHERE messages.message_to = $1 AND messages.message_archived = false"
        const result = await pool.query(sql, [user_id]);
        return result.rows;
    } catch (error) {
        return error.message
    }
}

/* ************************************
 * Update message status to read
 * ************************************/
async function updateMessageToRead(message_id) {
    try {
        const sql = "UPDATE messages SET message_read = true WHERE message_id = $1 RETURNING *"
        return await pool.query(sql, [message_id])
    } catch (error) {
        return error.message
    }
}

/* ************************************
 * Archive a message
 * ************************************/
async function archiveMessage(message_id) {
    try {
        const sql = "UPDATE messages SET message_archived = true WHERE message_id = $1 RETURNING *"
        return await pool.query(sql, [message_id])
    } catch (error) {
        return error.message
    }
}

/* ************************************
 * Retrieve archived messages by user ID
 * ************************************/
// async function getArchivedMessages(user_id) {
//     try {
//         const sql = "SELECT * FROM messages WHERE message_to = $1 AND message_archived = true ORDER BY message_created DESC"
//         const result = await pool.query(sql, [user_id]);
//         return result.rows;
//     } catch (error) {
//         return error.message;
//     }
// }
async function getArchivedMessages(account_id) {
    try {
        const sql = `
            SELECT messages.*, account.account_firstname, account.account_lastname
            FROM messages 
            JOIN account ON account.account_id = messages.message_from
            WHERE messages.message_to = $1 AND messages.message_archived = true
        `;
        const result = await pool.query(sql, [account_id]);
        return result.rows;
    } catch (error) {
        console.error(error);
        return error.message;
    }
}

/* ************************************
 * Retrieve a single message
 * ************************************/
async function getMessage(message_id) {
    try {
        const sql = `
            SELECT messages.*, account.account_firstname, account.account_lastname
            FROM messages 
            JOIN account ON account.account_id = messages.message_from
            WHERE message_id = $1
        `;
        const result = await pool.query(sql, [message_id]);
        return result.rows[0];
    } catch (error) {
        console.error(error);
        return error.message;
    }
}

/* ************************************
 * Delete a message
 * ************************************/
async function deleteMessage(message_id) {
    try {
        const sql = "DELETE FROM messages WHERE message_id = $1"
        return await pool.query(sql, [message_id]);
    } catch (error) {
        return error.message;
    }
}

/* *****************************
* Return unread messages count for a specific account
* ***************************** */
async function getUnreadMessageCount(account_id) {
    try {
      const result = await pool.query(
        'SELECT COUNT(*) FROM messages WHERE message_to = $1 AND message_read = false',
        [account_id]);
      return result.rows[0].count;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

module.exports = {
    createMessage,
    getMessagesByUser,
    updateMessageToRead,
    archiveMessage,
    getArchivedMessages,
    getMessage,
    deleteMessage,
    getUnreadMessageCount
}