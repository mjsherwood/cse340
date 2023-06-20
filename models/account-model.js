const pool = require("../database")


/* ******************************
 * Register new account
 * ******************************/
async function registerAccount(account_firstname, account_lastname, account_email, account_password, account_type){
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
}

/* *****************************
* Return account data using email address
* Unit 5 Activity
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}


/* *****************************
* Update Account
* Unit 5 Activity
* ***************************** */
async function updateAccount(
  account_id,
  account_firstname,
  account_lastname,
  account_email
) {
  try {
    console.log(account_id, account_firstname, account_lastname, account_email)
    const sql =
      "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}


/* *****************************
* Update Password
* Unit 5 Activity
* ***************************** */
const updatePassword = async (id, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const client = await pool.connect();
  try {
      const result = await pool.query('UPDATE account SET password = $1 WHERE account_id = $2 RETURNING *', [hashedPassword, id]);
      return result.rows[0];
  } finally {
      client.release();
  }
};

module.exports = { 
    registerAccount, 
    checkExistingEmail, 
    getAccountByEmail,
    updateAccount,
    updatePassword
}