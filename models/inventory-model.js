const pool = require("../database/")

/* ***************************
 * Get vehicle details
 * ************************** */
async function getVehicleById(inv_id) {
    try {
        const result = await pool.query('SELECT * FROM public.inventory WHERE inv_id = $1', [inv_id]);
        console.log("Query result:", result.rows);
        return result.rows[0];
    } catch (err) {
        console.error(`Error occurred while fetching vehicle by id: ${err.message}`);
        throw err;
    }
}
/* ***************************
 * Get all classification data
 * ************************** */
async function getClassifications(){
    try {
        return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
    } catch (err) {
        console.error(`Error occurred while fetching classifications: ${err.message}`);
        throw err;
    }
}


/* ***********************************
 * Get all vehicles and classification_name by classification_id
 * *********************************** */
async function getVehiclesByClassificationID(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        );
        return data.rows;
    } catch (error) {
        console.error("getVehiclesByClassificationID error: " + error);
        throw error;  // Re-throw the error after logging it
    }
}

module.exports = {getClassifications, getVehiclesByClassificationID, getVehicleById};


