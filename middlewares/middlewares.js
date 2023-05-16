const { addScema } = require("../utils/contactAddScema");
const { HttpError } = require("../helpers");

const noBody = (req, res, next) => {
    const keys = Object.keys(req.body);
    if (keys.length === 0) {
        next(HttpError(400, "missing fields"));
    }
    next()
}


const validate = (schema, res, obj, next) => {
  const validationLogs = schema.validate(obj)
 

  if (validationLogs.error) {
    return res.status(400).json({ message: `missing required ${validationLogs.error.details[0].path[0]} field`});
  }
  next()
}

module.exports = {
    noBody ,
    validateBody: (req, res, next) => {
    return validate( addScema, res, req.body, next)
  }};
