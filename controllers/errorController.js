const triggerError = async (req, res, next) => {
  try {
    // A math formula that intentionally throws a division by zero error
    const a = 10;
    const b = 0;
    if (b === 0) {
      const error = new Error("Intentionally triggered 500 error - Division by zero");
      error.status = 500;
      throw error;
    }
    const result = a / b;
  } catch (err) {
    next(err);
  }
};

module.exports = {
  triggerError
};